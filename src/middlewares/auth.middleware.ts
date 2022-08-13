import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env['TOKEN_SECRET'];

if (!TOKEN_SECRET) {
    throw Error('TOKEN_SECRET is not defined as an environment variable');
}

export const authenticateToken = ((tokenSecret: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            res.sendStatus(401);
            return;
        }

        try {
            jwt.verify(token, tokenSecret, (err, _payload) => {
                if (err) {
                    res.sendStatus(403);
                    return;
                }
    
                // req.user = user;
    
                next();
            });
        } catch(e) {
            res.sendStatus(400);
        }
    }
})(TOKEN_SECRET);
