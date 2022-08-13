import { AuthService } from '@app/services/auth.service';
import { ISignupRequest } from '@app/interfaces/auth.interface';
import { Req } from '@app/types/request.type';
import { Response } from 'express';

export class AuthController {
    public constructor(private readonly authService: AuthService) { }

    public signup(req: Req<ISignupRequest>, res: Response) {
        const token = this.authService.signup(req.body.username);

        if(token) {
            res.status(200).send(token);
        } else {
            res.status(400).send('Invalid credentials');
        }
    }
}