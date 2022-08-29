import { Response } from "express";
import { Types } from "mongoose";
import { z } from 'zod';
import { toZod } from 'tozod'

import { CommentsService } from '@app/services/comments.service';
import { IArticle } from "@app/interfaces/article.interface";
import { ArticlesService } from "@app/services/articles.service";
import { Req } from "@app/types/request.type";
import { Identifiable } from '@app/interfaces/identifiable.interface';
import { MongoDbValidId } from '@app/shared/valid-id';
import { Controller } from '@app/decorators/controller.decorator';
import { ControllerBase } from "@app/core/controller-base.core";
import { INVALID_ID } from "@app/constants/error-messages";
import { toStrictZod } from "@app/types/to-strict-zod.type";

@Controller
export class ArticlesController extends ControllerBase {

    public constructor(
        private readonly articlesService: ArticlesService,
        private readonly commentsService: CommentsService) {
        super();
    }

    public async fetch(res: Response) {
        res.status(200).send(await this.articlesService.fetch());
        return res;
    }

    public async create(req: Req<IArticle>, res: Response) {
        const validator: toZod<IArticle> = z.object({
            author: z.string(),
            body: z.string(),
            subtitle: z.string(),
            title: z.string()
        });

        const result = validator.safeParse(req.body);

        if (!result.success) {
            res.sendStatus(400);
            return res;
        }

        return res.status(201).send(await this.articlesService.create(req.body))
    }

    public async find(req: Req<unknown, Identifiable<string>>, res: Response) {
        const id = MongoDbValidId.tryCreateValidId(req.params.id);

        if (!id) {
            return res.status(400).send(INVALID_ID);
        }

        const result = await this.articlesService.find(id);

        if (result) {
            return res.status(200).send(result);
        } else {
            return res.sendStatus(404);
        }

    }

    public async update(req: Req<IArticle, Identifiable<string>>, res: Response) {
        const id = MongoDbValidId.tryCreateValidId(req.params.id);

        if (!id) {
            res.status(400).send(INVALID_ID);
            return res;
        }

        const validator: toStrictZod<IArticle> = (z.object({
            author: z.string(),
            body: z.string(),
            subtitle: z.string(),
            title: z.string()
        })).strict();

        const result = validator.safeParse(req.body);

        if (!result.success) {
            return res.status(400).send('Invalid UpdateArticleRequest');
        }

        const articleUpdated = await this.articlesService.update(id, req.body);

        if (articleUpdated) {
            return res.status(200).send(articleUpdated)
        } else {
            return res.sendStatus(404);
        }
    }

    public async remove(req: Req<unknown, Identifiable<string>>, res: Response) {
        const id = MongoDbValidId.tryCreateValidId(req.params.id);

        if (!id) {
            res.status(400).send(INVALID_ID);
            return;
        }

        await this.articlesService.remove(id);
        await this.commentsService.removeByArticleId(new Types.ObjectId(req.params.id));
        res.sendStatus(200);
    }
}
