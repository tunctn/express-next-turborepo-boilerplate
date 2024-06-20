import { HttpException } from '@/exceptions/http.exception';
import { type LuciaAuthUser } from '@/lib/auth';
import { ERROR } from '@/lib/errors';
import { createErrorBody } from '@/lib/errors/_create-error-body';
import { redis } from '@/lib/redis';
import { accessControlMiddleware, type AccessControlMiddlewareOptions } from '@/middlewares/access-validators';
import { authMiddleware, type RequestWithAuth, type RequestWithLooseAuth } from '@/middlewares/auth.middleware';
import { validationMiddleware, type RequestValidation } from '@/middlewares/validation.middleware';
import { CookieName, DEFAULT_LOCALE, type Locale, type UserRole } from '@packages/shared';
import dayjs from 'dayjs';
import { type NextFunction, type Request, type Response } from 'express';
import requestIp from 'request-ip';
import { logger } from './logger';

export type BaseRequest = Omit<Request, 'body' | 'params' | 'query'> & {
  body: unknown;
  params: unknown;
  query: unknown;
  locale: Locale;
  client_ip: string | null;
};
type AuthenticatedRequest = { user: LuciaAuthUser };
type LooseAuthenticatedRequest = { user?: LuciaAuthUser };

type BaseFn<ReqType> = {
  req: ReqType;
  res: Response;
  next: NextFunction;
};

export type ControllerMiddleware<ReqType, Promises = void> = ({ req, res, next }: BaseFn<ReqType>) => Promise<Promises>;

type BaseRedisOptions = {
  expire: number; // in seconds
  key: string;
};
type RedisMiddleware<ReqType> = ({ req, res, next }: BaseFn<ReqType>) => Partial<BaseRedisOptions>;
type RedisOptions<ReqType> = BaseRedisOptions & {
  redisMiddleware?: RedisMiddleware<ReqType>;
};

type AccessControlMiddleware<ReqType> = ({
  req,
  res,
  next,
}: BaseFn<ReqType>) => AccessControlMiddlewareOptions | Promise<AccessControlMiddlewareOptions>;

type ControllerOptions<ReqType, TParams = unknown, TQuery = unknown, TBody = unknown> = {
  withAuth: boolean;
  withLooseAuth: boolean;
  withAccessControl: false | AccessControlMiddleware<ReqType>;
  devOnly: boolean;
  validate?: RequestValidation<TParams, TQuery, TBody>;
  role?: UserRole;
  withRedis: false | RedisOptions<ReqType>;
  ignoreRedis: boolean;
  middlewares?: ControllerMiddleware<ReqType>[];
};

type RedisResponse = {
  redisResponse: any;
};

type RedisResponseBody = {
  body: any;
  expire: number;
  cached_at: string;
  status: number;
};

type ControllerBuilder<ExcludedMethods extends string, RequestType = BaseRequest, ResponseType = unknown> = Omit<
  Controller<ExcludedMethods, RequestType, ResponseType>,
  ExcludedMethods
>;

export class Controller<ExcludedMethods extends string = never, ReqType = BaseRequest, ResType = unknown> {
  private options: ControllerOptions<ReqType> = {
    withAuth: false,
    withLooseAuth: false,
    withAccessControl: false,
    devOnly: false,
    validate: undefined,
    role: undefined,
    withRedis: false,
    ignoreRedis: false,
  };

  /**
   *
   * @type MethodToExclude - Method to exclude from the returned object
   * @type TReq - Request type. It will append to the request type of the returned object
   * @type TRes - Response type. It will append to the response type of the returned object
   * @returns this - Returns the current instance of the class with the excluded method
   */
  private prepareBuild<MethodToExclude extends string = '', TReq = ReqType, TRes = ResType>(): ControllerBuilder<
    ExcludedMethods | MethodToExclude,
    TReq & ReqType,
    TRes & ResType
  > {
    return Object.assign(new Controller(), this) as any;
  }

  public validate = <TParams = unknown, TQuery = unknown, TBody = unknown>(schemas: RequestValidation<TParams, TQuery, TBody>) => {
    this.options.validate = schemas;

    return this.prepareBuild<'validate', { params: TParams; query: TQuery; body: TBody }>();
  };

  public withAuth = (options?: { role?: UserRole }) => {
    this.options.withAuth = true;
    this.options.role = options?.role ?? 'user';
    return this.prepareBuild<'withAuth' | 'withLooseAuth', AuthenticatedRequest>();
  };

  public withLooseAuth = (options?: { role?: UserRole }) => {
    this.options.withLooseAuth = true;
    this.options.role = options?.role ?? 'user';
    return this.prepareBuild<'withAuth' | 'withLooseAuth', LooseAuthenticatedRequest>();
  };

  public withAccessControl = (middleware: AccessControlMiddleware<ReqType>) => {
    this.options.withAccessControl = middleware;

    // Return controller with access control
    return this.prepareBuild<'withAccessControl', ReqType>();
  };

  public withMiddleware = <ReqAdd>(middleware: ControllerMiddleware<ReqAdd & ReqType>) => {
    const existingMiddlewares = this.options.middlewares ?? [];
    this.options.middlewares = [...existingMiddlewares, middleware as ControllerMiddleware<ReqType>];

    return this.prepareBuild<'', ReqAdd>(); // Can add multiple middlewares
  };

  public devOnly = () => {
    this.options.devOnly = true;

    return this.prepareBuild<'devOnly'>();
  };

  public useRedis = (middleware?: RedisMiddleware<ReqType & Omit<RedisOptions<ReqType>, 'redisMiddleware'>>) => {
    this.options.withRedis = {
      expire: 0,
      key: '',
    };

    if (middleware) {
      this.options.withRedis.redisMiddleware = middleware as RedisMiddleware<ReqType>;
    } else {
      this.options.withRedis.redisMiddleware = ({}) => ({});
    }

    return this.prepareBuild<'useRedis', ReqType, RedisResponse>();
  };

  public build(executeFn: ({ req, res, next }: { req: ReqType; res: Response; next: NextFunction }) => Promise<ResType>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const clientIp = requestIp.getClientIp(req);
        (req as BaseRequest).client_ip = clientIp;

        const localeCookie = req.cookies[CookieName.ApiLocale];
        (req as BaseRequest).locale = localeCookie ?? DEFAULT_LOCALE;

        if (this.options.devOnly && process.env['NODE_ENV'] !== 'development') {
          return res.status(403).json({ message: 'Forbidden' });
        }

        // Test auth and assign user to request
        if (this.options.withAuth) {
          // Check if user is authenticated
          const authUser = await authMiddleware({ req, res });
          (req as RequestWithAuth).user = authUser!!; // !! is required because of anti-loose null check

          // Admin can access all routes
          if (authUser!!.role !== 'admin') {
            // Check if user has the required role
            if (this.options.role !== authUser!!.role) {
              return res.status(403).json({ message: 'Forbidden' });
            }
          }
        }

        // Test loose auth and assign user to request
        if (this.options.withLooseAuth) {
          // Check if user is authenticated
          const authUser = await authMiddleware({ req, res, loose: true });
          (req as RequestWithLooseAuth).user = authUser;

          // Renegade admin can access all routes
          if (authUser?.role !== 'admin') {
            // Check if user has the required role
            if (this.options.role !== authUser?.role) {
              return res.status(403).json({ message: 'Forbidden' });
            }
          }
        }

        // Get redis key
        let redisKey = `${req.method}:${req.originalUrl}`;
        if (this.options.withRedis) {
          const redisOptions = this.options.withRedis.redisMiddleware!({ req: req as ReqType, res, next });
          this.options.withRedis = { ...this.options.withRedis, ...redisOptions };
          redisKey = redisOptions.key ?? redisKey;
        }

        // Validate request
        if (this.options.validate) {
          const errors = validationMiddleware({ ...this.options.validate, req });

          // Return validation errors as response
          if (errors.length > 0) {
            return res.status(400).json({ errors });
          }
        }

        // Execute middlewares
        if (this.options.middlewares) {
          for (const middleware of this.options.middlewares) {
            await middleware({ req: req as ReqType, res, next });
          }
        }

        // Execute access control
        if (this.options.withAccessControl) {
          if (!this.options.withAuth) throw new HttpException(500, ERROR.ACCESS_CONTROL['requires-auth-middleware']);

          const accessControlOptions = await this.options.withAccessControl({ req: req as ReqType, res, next });
          await accessControlMiddleware({ req: req as RequestWithAuth, ...accessControlOptions });
        }

        // Check if redis is enabled and ignore cache
        const ignoreRedisCacheHeader = req.get('X-Ignore-Redis-Cache');
        const ignoreRedisCache = ignoreRedisCacheHeader === 'true';
        if (ignoreRedisCache) {
          this.options.ignoreRedis = true;
          res.setHeader('X-Redis-Cache', 'ignored');
        } else {
          this.options.ignoreRedis = false;
        }

        // Check if redis is enabled and return cached response
        try {
          if (this.options.withRedis && this.options.ignoreRedis === false) {
            const cachedResponse = await redis.get(redisKey);
            if (cachedResponse) {
              const { status, body, cached_at, expire } = cachedResponse as RedisResponseBody;

              res.setHeader('X-Redis-Cache', 'hit');
              res.setHeader('X-Redis-Cache-Expire', expire);
              res.setHeader('X-Redis-Cache-Cached-At', cached_at);

              // Update expire time if it's not the same
              if (expire !== this.options.withRedis.expire) {
                await redis.expire(redisKey, this.options.withRedis.expire);
              }

              return res.status(status).json(body);
            }
            res.setHeader('X-Redis-Cache', 'miss');
          }
        } catch (e) {
          logger.error(e);
          logger.debug('Redis error. Falling back to normal response.');
        }

        // Execute controller function
        const execute = await executeFn({ req: req as ReqType, res, next });

        // Return response
        if (this.options.withRedis) {
          // Get redis response from controller
          // It should be an object with a key of redisResponse
          const { redisResponse } = execute as unknown as RedisResponse;

          // Cache response to Redis
          const redisBody: RedisResponseBody = {
            body: redisResponse,
            expire: this.options.withRedis.expire,
            cached_at: dayjs().toISOString(),
            status: res.statusCode,
          };

          if (this.options.ignoreRedis === false) {
            await redis.set(redisKey, JSON.stringify(redisBody, null, 2));
            if (this.options.withRedis.expire > 0) {
              await redis.expire(redisKey, this.options.withRedis.expire);
            }
          } else {
            await redis.del(redisKey);
          }

          // Return response
          return res.status(res.statusCode).json(redisResponse);
        } else {
          return execute;
        }
      } catch (err: any) {
        const { logMessage, status, body } = createErrorBody(err, req);
        logger.error(`[${req.method}] ${req.path} >> Controller :: StatusCode:: ${status}, Message:: ${logMessage}, `);
        return res.status(status).json(body);
      }
    };
  }
}

export const createController = () => new Controller();
