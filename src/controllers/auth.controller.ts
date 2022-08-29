import { Response } from 'express';

import { AuthService } from '@app/services/auth.service';
import { ISignupRequest } from '@app/interfaces/auth.interface';
import { Req } from '@app/types/request.type';
import { ControllerBase } from '@app/core/controller-base.core';
import { Controller } from '@app/decorators/controller.decorator';

@Controller
export class AuthController extends ControllerBase {
    public constructor(private readonly authService: AuthService) { 
        super();
    }

    public signup(req: Req<ISignupRequest>, res: Response) {
        const token = this.authService.signup(req.body.username);

        if(token) {
            res.status(200).send(token);
        } else {
            res.status(400).send('Invalid credentials');
        }
    }
}