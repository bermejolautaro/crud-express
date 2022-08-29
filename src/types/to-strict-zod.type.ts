import { z } from 'zod';
declare type isAny<T> = [any extends T ? 'true' : 'false'] extends ['true'] ? true : false;
declare type equals<X, Y> = [X] extends [Y] ? ([Y] extends [X] ? true : false) : false;
export declare type toStrictZod<T> =
    isAny<T> extends true
    ? never
    : [T] extends [boolean]
    ? z.ZodBoolean
    : [undefined] extends [T]
    ? T extends undefined ? never : z.ZodOptional<toStrictZod<T>>
    : [null] extends [T] ? T extends null ? never : z.ZodNullable<toStrictZod<T>> : T extends Array<infer U>
    ? z.ZodArray<toStrictZod<U>>
    : T extends Promise<infer U>
    ? z.ZodPromise<toStrictZod<U>>
    : equals<T, string> extends true
    ? z.ZodString
    : equals<T, bigint> extends true
    ? z.ZodBigInt
    : equals<T, number> extends true
    ? z.ZodNumber
    : equals<T, Date> extends true
    ? z.ZodDate
    : T extends {
        [k: string]: any;
    } ? z.ZodObject<{
        [k in keyof T]-?: toStrictZod<T[k]>;
    }, 'strict', z.ZodTypeAny, T, T> : never;
export { };
