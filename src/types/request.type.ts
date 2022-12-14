import { Request } from 'express';

export type Req<
    TRequestBody = unknown, 
    TRequestParams = unknown,
    TRequestQuery extends qs.ParsedQs = {}> = Request<TRequestParams, unknown, TRequestBody, TRequestQuery>
