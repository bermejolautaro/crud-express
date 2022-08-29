import { Router } from 'express';

import { authenticateToken } from '@app/middlewares/auth.middleware';
import { CommentsController } from '@app/controllers/comments.controller';
import { CommentsRepository, createCommentsRepository } from '@app/models/comment.model';
import { CommentsService } from '@app/services/comments.service';
import { Req } from '@app/types/request.type';
import { setupController } from '@app/core/controller.core';
import { Identifiable } from '@app/interfaces/identifiable.interface';

const commentsRepository: CommentsRepository = createCommentsRepository();
const commentsService = new CommentsService(commentsRepository);
const commentsController = new CommentsController(commentsService);

const controller = setupController(commentsController);

export const commentsApi = (router: Router) => {
    const articlesRouter = Router();
    
    router.use('/comments', articlesRouter);
    articlesRouter.get('/', (req: Req<unknown, unknown, { articleId: string; }>, res, next) => controller(next).fetch(req, res));
    articlesRouter.post('/', (req, res, next) => controller(next).create(req, res));
    articlesRouter.get('/:id', (req: Req<unknown, Identifiable<string>, { articleId: string; }>, res, next) => controller(next).find(req, res));
    articlesRouter.put('/:id', (req, res, next) => controller(next).update(req, res));
    articlesRouter.delete(
        '/:id', 
        (req, res, next) => authenticateToken(req, res, next), 
        (req, res, next) => controller(next).remove(req, res));
    
    return router;
}