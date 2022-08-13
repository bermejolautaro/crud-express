import { AuthService } from './../services/auth.service';
import { Router } from "express";
import { AuthController } from '@app/controllers/auth.controller';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env['TOKEN_SECRET'];

if (!TOKEN_SECRET) {
    throw Error('TOKEN_SECRET is not defined as an environment variable');
}

const authService = new AuthService(TOKEN_SECRET);
const authController = new AuthController(authService);

export const authApi = (router: Router) => {
    const authRouter = Router();
    
    router.use('/auth', authRouter);
    authRouter.post('/', (req, res) => authController.signup(req, res));
    
    return router;
}