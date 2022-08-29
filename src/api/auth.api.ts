import { AuthService } from './../services/auth.service';
import { Router } from "express";
import { AuthController } from '@app/controllers/auth.controller';
import dotenv from 'dotenv';
import { setupController } from '@app/core/controller.core';

dotenv.config();

const TOKEN_SECRET = process.env['TOKEN_SECRET'];

if (!TOKEN_SECRET) {
    throw Error('TOKEN_SECRET is not defined as an environment variable');
}

const authService = new AuthService(TOKEN_SECRET);
const authController = new AuthController(authService);

const controller = setupController(authController);

export const authApi = (router: Router) => {
    const authRouter = Router();
    
    router.use('/auth', authRouter);
    authRouter.post('/', (req, res, next) => controller(next).signup(req, res));
    
    return router;
}