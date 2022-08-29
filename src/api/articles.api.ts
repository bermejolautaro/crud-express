import { Router } from "express";

import { authenticateToken } from '@app/middlewares/auth.middleware';
import { ArticlesService } from '@app/services/articles.service';
import { ArticlesController } from "@app/controllers/articles.controller";
import { createArticlesDataAccess, ArticlesDataAccess } from '@app/models/article.model';
import { CommentsService } from '@app/services/comments.service';
import { CommentsRepository, createCommentsRepository } from '@app/models/comment.model';
import { IArticlesRepository, MongoDbArticlesRepository } from '@app/repositories/mongodb-articles.repository';
import { setupController } from '@app/core/controller.core';


const commentsRepository: CommentsRepository = createCommentsRepository();
const commentsService = new CommentsService(commentsRepository);
const articlesDataAccess: ArticlesDataAccess = createArticlesDataAccess();
const articlesRepository: IArticlesRepository = new MongoDbArticlesRepository(articlesDataAccess);
const articlesService = new ArticlesService(articlesRepository);
const articlesController = new ArticlesController(articlesService, commentsService);

const controller = setupController(articlesController);

export const articlesApi = (router: Router) => {
    const articlesRouter = Router();
    
    router.use('/articles', articlesRouter);
    articlesRouter.get('/', (_req, res, next) => controller(next).fetch(res));
    articlesRouter.post('/', (req, res, next) => controller(next).create(req, res));
    articlesRouter.get('/:id', (req, res, next) => controller(next).find(req, res));
    articlesRouter.put('/:id', (req, res, next) => controller(next).update(req, res));
    
    articlesRouter.delete('/:id', 
        (req, res, next) => authenticateToken(req, res, next), 
        (req, res, next) => controller(next).remove(req, res));
    
    return router;
}