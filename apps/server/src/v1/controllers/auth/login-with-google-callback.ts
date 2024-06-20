import { HttpException } from '@/exceptions/http.exception';
import { createController } from '@/utils/controller';
import { CookieName } from '@packages/shared';
import { parseCookies } from 'oslo/cookie';
import { z } from 'zod';

export const loginWithGoogleCallback = createController()
  .validate({
    query: z.object({
      code: z.string(),
      state: z.string(),
    }),
  })
  .build(async ({ req, res }) => {
    const cookies = parseCookies(req.headers.cookie ?? '');
    const storedState = cookies.get(CookieName.GoogleOAuthState) ?? '';
    const state = req.query.state;
    const code = req.query.code;

    // validate state
    if (!storedState || !state || storedState !== state || typeof code !== 'string') {
      return res.sendStatus(400);
    }

    try {
      // 			// generate state
      // const state = generateState();
      //       const { getExistingUser, googleUser, createUser } = await googleAuth.createAuthorizationURL(code);
      //       const getUser = async (): Promise<User> => {
      //         const existingUser = await getExistingUser();
      //         if (existingUser) return existingUser;
      //         if (!googleUser) throw new Error('Google user not found');
      //         if (!googleUser.email) throw new Error('Google user email not found');
      //         const userId = newId();
      //         const randomNumbers = Math.floor(Math.random() * 1000000);
      //         const userPayload: InsertUser = {
      //           id: userId,
      //           username: googleUser.email.split('@')[0] + '_' + randomNumbers,
      //           firstName: googleUser.given_name,
      //           lastName: googleUser.family_name,
      //           emailAddress: googleUser.email,
      //           role: 'user',
      //           image: googleUser.picture,
      //           isEmailAddressVerified: googleUser.email_verified ?? false,
      //           createdAt: new Date(),
      //           updatedAt: null,
      //           deletedAt: null,
      //         };
      //         // Check if we have a user with the same email address
      //         const existingDbUserRows = await db.select().from(users).where(eq(users.emailAddress, userPayload.emailAddress));
      //         const existingDbUser = existingDbUserRows[0];
      //         const createSignupMethod = async () => {
      //           const method: SignUpMethod = 'GOOGLE';
      //           await db.insert(userSignupMethods).values({
      //             id: newId(),
      //             userId: user.id,
      //             method: method,
      //             key: `${user.id}:${method}`,
      //             payload: JSON.stringify(googleUser),
      //             createdAt: new Date(),
      //           });
      //         };
      //         // Just create a new user and return it if we don't have a user with the same email address
      //         if (!existingDbUser) {
      //           // const user = await createUser({ userId, attributes: });
      //           await createSignupMethod();
      //           return user;
      //         }
      //         // This means we have a user with the same email address but signed up with a different method
      //         // So we can't be sure if they are the same person
      //         if (existingDbUser.isEmailAddressVerified === false) {
      //           // Check if the user has already signed up with google, even though they haven't verified their email address
      //           const signupMethods = await db.select().from(userSignupMethods).where(eq(userSignupMethods.userId, existingDbUser.id));
      //           if (signupMethods.find(method => method.method === 'GOOGLE')) {
      //             // Mark the user's email address as verified
      //             await db.update(users).set({ isEmailAddressVerified: true }).where(eq(users.id, existingDbUser.id));
      //             return existingDbUser;
      //           }
      //           // If the user hasn't signed up with google, we can't be sure if they are the same person
      //           throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['signup.email-already-registered-with-another-signup-method']);
      //         }
      //         // This means we are sure that the user is the same person
      //         await createSignupMethod();
      //         return existingDbUser;
      //       };
      //       const user = await getUser();
      //       const session = await lucia.createSession(user.id, {});
      //       await authService.luciaSessionHandler({ session, req, res });
      //       return res.status(302).setHeader('Location', '/').end();

      return res.status(500).json({ message: 'Unimplemented' });
    } catch (e) {
      if (e instanceof HttpException) {
        return res.status(e.status).send(e.message);
      }

      return res.sendStatus(500);
    }
  });
