import { Request } from 'express';

export type Req<
    TRequestBody = unknown, 
    TRequestParams = unknown,
    TRequestQuery = unknown> = Request<TRequestParams, unknown, TRequestBody, TRequestQuery>
