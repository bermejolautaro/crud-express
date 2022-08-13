import { IExistingArticle } from './../src/interfaces/article.interface';
import { IArticle } from '@app/interfaces/article.interface';
import { createCommentsRepository } from './../src/models/comment.model';
import { CommentsService } from '@app/services/comments.service';
import { ArticlesService } from '@app/services/articles.service';
import { createArticlesRepository } from '@app/models/article.model';
import { ArticlesController } from '@app/controllers/articles.controller';
import { createRequest, createResponse } from 'node-mocks-http'
import { EventEmitter } from 'events';
import { Request } from 'express';
import { Types } from 'mongoose';

describe('ArticlesController Tests', () => {
    const NOT_FOUND = 'Not Found';
    const ARTICLES = [
        { _id: '62f13a3a8707a6da6ff47350', author: '', body: '', subtitle: '', title: '' },
        { _id: '62f13a3a8707a6da6ff47355', author: '', body: '', subtitle: '', title: '' },
    ] as const;

    describe('ArticlesController.fetch Tests', () => {
        it('when fetching then status code should be 200 and body the same as the mocked one', done => {
            const response = createResponse({ eventEmitter: EventEmitter });
            const articlesController = new ArticlesController(createArticlesServiceMock(ARTICLES), createCommentsServiceMock());

            response.on('send', () => {
                const result: IArticle[] = response._getData();
                try {
                    expect(response.statusCode).toBe(200);
                    expect(result).toEqual(ARTICLES);
                    done();
                } catch (error) {
                    done(error);
                }
            })

            articlesController.fetch(response);
        })
    })

    describe('ArticlesController.find Tests', () => {
        it(`when fetching by existing id then status code should be 200 and body the same as the mocked existing element`, done => {
            const response = createResponse({ eventEmitter: EventEmitter });
            const articlesController = new ArticlesController(createArticlesServiceMock(ARTICLES), createCommentsServiceMock());
            const request = createRequest<Request<{ id: string }>>({
                params: { id: '62f13a3a8707a6da6ff47350' },
            });

            response.on('send', () => {
                const result: IArticle[] = response._getData();
                try {
                    expect(response.statusCode).toBe(200);
                    expect(result).toEqual(ARTICLES[0]);
                    done();
                } catch (error) {
                    done(error);
                }
            })

            articlesController.find(request, response);
        })

        it(`when fetching by not existing but valid id then status code should be 404`, done => {
            const request = createRequest<Request<{ id: string }>>({
                params: { id: '62f13a3a8707a6da6ff47340' },
            });
            const response = createResponse({ eventEmitter: EventEmitter });
            const articlesController = new ArticlesController(createArticlesServiceMock(ARTICLES), createCommentsServiceMock());

            response.on('send', () => {
                const result: IArticle[] = response._getData();
                try {
                    expect(response.statusCode).toBe(404);
                    expect(result).toEqual(NOT_FOUND);
                    done();
                } catch (error) {
                    done(error);
                }
            })

            articlesController.find(request, response);
        })
    })

    describe('ArticlesController.update Tests', () => {
        it('', () => {
            
        })
    })
})

const createArticlesServiceMock = (articles: readonly IExistingArticle[]) => {
    const articlesService = new ArticlesService(createArticlesRepository());
    const mocked = jest.mocked(articlesService);

    mocked.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(articles)
    })

    mocked.find = jest.fn().mockImplementation((id: Types.ObjectId) => {
        console.log(id);
        return Promise.resolve(articles.find(x => x._id === id.toString()));
    })

    mocked.create = jest.fn();
    mocked.remove = jest.fn();
    mocked.update = jest.fn();

    return articlesService;
}

const createCommentsServiceMock = () => {
    const commentsService = new CommentsService(createCommentsRepository());
    const mocked = jest.mocked(commentsService);

    mocked.create = jest.fn();
    mocked.fetch = jest.fn();
    mocked.find = jest.fn();
    mocked.remove = jest.fn();
    mocked.removeByArticleId = jest.fn();
    mocked.update = jest.fn();

    return commentsService;
}