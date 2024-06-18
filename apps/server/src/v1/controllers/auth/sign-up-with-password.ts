import { createController } from '@/utils/controller';
import { authService } from '@/v1/services/auth';
import { SignUpWithPasswordSchema, type SignUpWithPasswordResponse } from '@packages/shared';

export const signUpWithPassword = createController()
  .validate({
    body: SignUpWithPasswordSchema,
  })
  .build(async ({ req, res }) => {
    const payload = req.body;
    const { user } = await authService.signUpWithPassword({ payload });

    const response: SignUpWithPasswordResponse = {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      role: user.role,
      is_email_address_verified: user.is_email_address_verified,
    };

    res = await authService.luciaSessionHandler({ userId: user.id, res });

    return res.status(200).json(response);
  });
