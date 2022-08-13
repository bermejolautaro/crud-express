import { IExistingArticle } from "./article.interface";

export interface IComment {
    author: string;
    body: string,
    article: string | IExistingArticle;
}