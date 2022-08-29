import { EventEmitter } from 'events';
import { createRequest, createResponse } from 'node-mocks-http'
import { mock } from 'jest-mock-extended';
import { Request } from 'express';

import { IExistingArticle } from '@app/interfaces/article.interface';
import { IArticle } from '@app/interfaces/article.interface';
import { createCommentsRepository } from '@app/models/comment.model';
import { CommentsService } from '@app/services/comments.service';
import { ArticlesService } from '@app/services/articles.service';
import { ArticlesController } from '@app/controllers/articles.controller';
import { IArticlesRepository } from '@app/repositories/mongodb-articles.repository';
import { MockResult } from 'tests/interfaces/mock-result.interface';
import { mockResult } from './helpers/mock.helper';
import { description } from './helpers/description.helper';

describe('ArticlesController Tests', () => {
    const NOT_FOUND = 'Not Found';
    const INVALID_ID = 'Invalid Id';
    const ARTICLES = [
        { _id: '62f13a3a8707a6da6ff47350', author: '', body: '', subtitle: '', title: '' },
        { _id: '62f13a3a8707a6da6ff47355', author: '', body: '', subtitle: '', title: '' },
    ] as const;

    describe('ArticlesController.fetch Tests', () => {
        it(description(
            'GIVEN empty request',
            'WHEN fetching',
            'THEN status code should be 200',
            'AND body the same as the mocked one'), done => {
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
        it(description(
            'GIVEN a valid and existing id',
            'WHEN finding an user',
            'THEN status code should be 200',
            'AND body the same as the mocked existing element'), done => {
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

        it(description(
            'GIVEN valid but not existing id',
            'WHEN finding an user',
            'THEN status code should be 404'), done => {
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
        it(description(
            'GIVEN valid body and valid id',
            'WHEN updating by existing id',
            'THEN status code should be 200',
            'AND article should be equal to the provided body'), done => {
                const response = createResponse({ eventEmitter: EventEmitter });
                const articlesController = new ArticlesController(createArticlesServiceMock(ARTICLES), createCommentsServiceMock());
                const expectedArticle: IArticle = {
                    author: 'An author',
                    body: 'A body',
                    subtitle: 'A subtitle',
                    title: 'A title'
                }

                const request = createRequest<Request<{ id: string }, unknown, IArticle>>({
                    params: { id: '62f13a3a8707a6da6ff47350' },
                    body: expectedArticle
                });

                response.on('send', () => {
                    const { result }: MockResult<IArticle> = response._getData();
                    try {
                        expect(response.statusCode).toBe(200);
                        expect(result).toEqual(expectedArticle);
                        done();
                    } catch (error) {
                        done(error);
                    }
                })

                articlesController.update(request, response);
            })

        it(description(
            'GIVEN any body and invalid id',
            'WHEN updating an article',
            'THEN it should return status 400 with expected error message'), done => {
                const request = createRequest<Request<{ id: string }>>({
                    params: { id: 'invalidid' },
                });
                const response = createResponse({ eventEmitter: EventEmitter });
                const articlesController = new ArticlesController(createArticlesServiceMock(ARTICLES), createCommentsServiceMock());

                response.on('send', () => {
                    const result: IArticle[] = response._getData();
                    try {
                        expect(response.statusCode).toBe(400);
                        expect(result).toEqual(INVALID_ID);
                        done();
                    } catch (error) {
                        done(error);
                    }
                })

                articlesController.update(request, response);
            })

        it(description(
            'GIVEN invalid body and valid id',
            'WHEN updating an article',
            'THEN it should return status 400 with expected error message'), done => {
                const requestArticle: Partial<IArticle> & Record<string, string> = {
                    author: 'An author',
                    body: 'A body',
                    subtitle: 'A subtitle'
                };

                const request = createRequest<Request<{ id: string }>>({
                    params: { id: '62f13a3a8707a6da6ff47350' },
                    body: requestArticle
                });

                const response = createResponse({ eventEmitter: EventEmitter });
                const articlesController = new ArticlesController(createArticlesServiceMock(ARTICLES), createCommentsServiceMock());

                response.on('send', () => {
                    const result: IArticle[] = response._getData();
                    try {
                        expect(response.statusCode).toBe(400);
                        expect(result).toEqual('Invalid UpdateArticleRequest');
                        done();
                    } catch (error) {
                        done(error);
                    }
                })

                articlesController.update(request, response);
            })
    })
})

const createArticlesServiceMock = (articles: readonly IExistingArticle[]) => {
    const articlesRepositoryMock = mock<IArticlesRepository>();

    articlesRepositoryMock.fetch.mockReturnValue(Promise.resolve([...articles]));

    articlesRepositoryMock.find.mockImplementation((id) => {
        return Promise.resolve(articles.find(x => x._id === `${id.value}`) ?? null);
    })

    articlesRepositoryMock.update.mockImplementation((_id, article) => {
        return Promise.resolve(mockResult(article) as any);
    });

    return new ArticlesService(articlesRepositoryMock);
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