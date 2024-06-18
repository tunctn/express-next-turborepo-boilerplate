import type { Route } from '@/interfaces/routes.interface';
import { usersController as c } from '@/v1/controllers/users';
import { Router } from 'express';

const router = Router();
const path = '/users';

router.get('/me', c.getMe);

export const usersRoute: Route = { path, router };
