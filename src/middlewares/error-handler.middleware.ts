import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (_error: unknown, _req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ error: 'Something went wrong.' });
    next();
}