import { HttpException } from '@/exceptions/http.exception';
import { AccessValidator } from './_access-validator';

import { ERROR } from '@/lib/errors';
import { UserRole } from '@packages/shared';
import { RequestWithAuth } from '../auth.middleware';
import { PlaylistAccessType, getPlaylistAccessValidatorKey, playlistAccessValidator } from './playlist.validator';

const accessValidator = AccessValidator.getInstance();

export type AccessControlMiddlewareOptions =
  | { scope: 'playlist'; playlistId: string; type: PlaylistAccessType }
  | { scope: 'user-role'; role: UserRole };

export type AccessControlMiddlewareProps = AccessControlMiddlewareOptions & {
  req: RequestWithAuth;
};

export const accessControlMiddleware = async (params: AccessControlMiddlewareProps): Promise<boolean> => {
  const { req, scope } = params;
  if (!req.user) {
    throw new HttpException(401, ERROR.GENERIC.unauthorized);
  }

  const userId = req.user.id;
  const reqUserRole = req.user.role;
  if (reqUserRole === 'admin') return true;

  // Check user role
  if (scope === 'user-role') {
    const { role } = params;
    if (reqUserRole === 'user' && role !== 'user') {
      throw new HttpException(403, ERROR.GENERIC.forbidden);
    }
  }

  if (scope === 'playlist') {
    const { playlistId, type } = params;
    const key = getPlaylistAccessValidatorKey({ playlistId, userId, type });
    const hasAccess = await accessValidator.validateAccess({
      key,
      validator: async () => await playlistAccessValidator({ playlistId, userId, type }),
    });
    if (!hasAccess) {
      throw new HttpException(403, ERROR.GENERIC.forbidden);
    }
  }

  return true;
};
