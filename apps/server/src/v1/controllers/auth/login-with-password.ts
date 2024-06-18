import { createController } from '@/utils/controller';
import { authService } from '@/v1/services/auth';
import {
  LoginWithEmailPasswordResponse,
  LoginWithEmailPasswordSchema,
  LoginWithUsernamePasswordResponse,
  LoginWithUsernamePasswordSchema,
} from '@packages/shared';

export const loginWithEmailPassword = createController()
  .validate({
    body: LoginWithEmailPasswordSchema,
  })
  .build(async ({ req, res }) => {
    const payload = req.body;
    const { user } = await authService.loginWithPassword({ payload });

    const response: LoginWithEmailPasswordResponse = {
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

export const loginWithUsernamePassword = createController()
  .validate({
    body: LoginWithUsernamePasswordSchema,
  })
  .build(async ({ req, res }) => {
    const payload = req.body;
    const { user } = await authService.loginWithPassword({ payload });

    const response: LoginWithUsernamePasswordResponse = {
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
