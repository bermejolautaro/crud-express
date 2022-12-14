import { Response } from 'express';
import { isValidObjectId, Types } from "mongoose";

import { ControllerBase } from '@app/core/controller-base.core';
import { Controller } from '@app/decorators/controller.decorator';
import { IComment } from '@app/interfaces/comment.interface';
import { Identifiable } from '@app/interfaces/identifiable.interface';
import { CommentsService } from "@app/services/comments.service";
import { Req } from "@app/types/request.type";

@Controller
export class CommentsController extends ControllerBase {
    public constructor(private readonly commentsService: CommentsService) {
        super();
     }

    public async fetch(req: Req<unknown, unknown, { articleId: string }>, res: Response) {
        if(req.query.articleId && !isValidObjectId(req.query.articleId)) {
            res.status(400).send('Invalid articleId');
            return;
        }

        res.status(200).send(await this.commentsService.fetch(new Types.ObjectId(req.query.articleId)));
    }

    public async create(req: Req<IComment>, res: Response) {
        res.status(201).send(await this.commentsService.create(req.body))
    }

    public async find(req: Req<unknown, Identifiable<string>, { articleId: string }>, res: Response) {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid id');
            return;
        }

        if(req.query.articleId && !isValidObjectId(req.query.articleId)) {
            res.status(400).send('Invalid articleId');
            return;
        }

        res.status(200).send(await this.commentsService.find(
            new Types.ObjectId(req.params.id), 
            new Types.ObjectId(req.query.articleId)));
    }

    public async update(req: Req<IComment, Identifiable<string>>, res: Response) {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid id');
            return;
        }

        res.status(200).send(await this.commentsService.update(new Types.ObjectId(req.params.id), req.body))
    }

    public async remove(req: Req<unknown, Identifiable<string>>, res: Response) {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid id');
            return;
        }

        res.status(200).send(await this.commentsService.remove(new Types.ObjectId(req.params.id)));
    }
}