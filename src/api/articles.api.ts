import { authenticateToken } from './../middlewares/auth.middleware';
import { ArticlesService } from '@app/services/articles.service';
import { ArticlesController } from "@app/controllers/articles.controller";
import { createArticlesRepository, ArticlesRepository } from '@app/models/article.model';
import { Router, Response } from "express";
import { Req } from '@app/types/request.type';
import { CommentsService } from '@app/services/comments.service';
import { CommentsRepository, createCommentsRepository } from '@app/models/comment.model';


const commentsRepository: CommentsRepository = createCommentsRepository();
const commentsService = new CommentsService(commentsRepository);
const articlesRepository: ArticlesRepository = createArticlesRepository();
const articlesService = new ArticlesService(articlesRepository);
const articlesController = new ArticlesController(articlesService, commentsService);

export const articlesApi = (router: Router) => {
    const articlesRouter = Router();
    
    router.use('/articles', articlesRouter);
    articlesRouter.get('/', (_req, res) => articlesController.fetch(res));
    articlesRouter.post('/', (req, res) => articlesController.create(req, res));
    articlesRouter.get('/:id', (req, res) => articlesController.find(req, res));
    articlesRouter.put('/:id', (req, res) => articlesController.update(req, res));
    articlesRouter.delete(
        '/:id',
        authenticateToken,
        (req: Req<unknown, { id: string }>, res: Response) => articlesController.remove(req, res));
    
    return router;
}