import { authApi } from './auth.api';
import { commentsApi } from './comments.api';
import { articlesApi } from '@app/api/articles.api';
import { Router } from "express"

export const api = (router: Router) => {
    router.use('/', articlesApi(Router()));
    router.use('/', commentsApi(Router()));
    router.use('/', authApi(Router()));

    return router;
}