import { CommentsService } from '@app/services/comments.service';
import { IArticle } from "@app/interfaces/article.interface";
import { ArticlesService } from "@app/services/articles.service";
import { Req } from "@app/types/request.type";
import { Response } from "express";
import { isValidObjectId, Types } from "mongoose";

type ParamsId = { id: string };

export class ArticlesController {

    public constructor(
        private readonly articlesService: ArticlesService, 
        private readonly commentsService: CommentsService) { }

    public async fetch(res: Response) {
        res.status(200).send(await this.articlesService.fetch());
        return res;
    }

    public async create(req: Req<IArticle>, res: Response) {
        res.status(201).send(await this.articlesService.create(req.body))
    }

    public async find(req: Req<unknown, ParamsId>, res: Response) {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid id');
        }

        const result = await this.articlesService.find(new Types.ObjectId(req.params.id));

        if(result) {
            return res.status(200).send(result);
        } else {
            return res.sendStatus(404);
        }

    }

    public async update(req: Req<IArticle, ParamsId>, res: Response) {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid id');
            return;
        }

        const articleUpdated = await this.articlesService.update(new Types.ObjectId(req.params.id), req.body);

        if(articleUpdated) {
            res.status(200).send(articleUpdated)
        } else {
            res.sendStatus(404);
        }
    }

    public async remove(req: Req<unknown, ParamsId>, res: Response) {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid id');
            return;
        }

        await this.articlesService.remove(new Types.ObjectId(req.params.id));
        await this.commentsService.removeByArticleId(new Types.ObjectId(req.params.id));
        res.sendStatus(200);
    }
}
 