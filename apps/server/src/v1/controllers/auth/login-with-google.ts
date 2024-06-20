import { createController } from '@/utils/controller';

export const loginWithGoogle = createController().build(async ({ res }) => {
  // const [url, state] = await googleAuth.getAuthorizationUrl();
  // res.cookie(GOOGLE_AUTH_COOKIE_NAME, state, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   path: '/',
  //   maxAge: 60 * 60 * 1000, // 1 hour
  // });
  return res.status(302).setHeader('Location', '').end();
});
