import { authenticateToken } from '@app/middlewares/auth.middleware';
import { CommentsController } from '@app/controllers/comments.controller';
import { CommentsRepository, createCommentsRepository } from '@app/models/comment.model';
import { CommentsService } from '@app/services/comments.service';
import { Req } from '@app/types/request.type';
import { Router, Response } from 'express';

const commentsRepository: CommentsRepository = createCommentsRepository();
const commentsService = new CommentsService(commentsRepository);
const commentsController = new CommentsController(commentsService);

export const commentsApi = (router: Router) => {
    const articlesRouter = Router();
    
    router.use('/comments', articlesRouter);
    articlesRouter.get('/', (req: Req<unknown, unknown, { articleId: string}>, res) => commentsController.fetch(req, res));
    articlesRouter.post('/', (req, res) => commentsController.create(req, res));
    articlesRouter.get('/:id', (req: Req<unknown, { id: string }, { articleId: string}>, res) => commentsController.find(req, res));
    articlesRouter.put('/:id', (req, res) => commentsController.update(req, res));
    articlesRouter.delete(
        '/:id', 
        authenticateToken, 
        (req: Req<unknown, { id: string }>, res: Response) => commentsController.remove(req, res));
    
    return router;
}