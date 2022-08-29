import mongoose from "mongoose";

export const ARTICLE_REF = 'ARTICLE';

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    author: { type: String, required: true },
    body: { type: String, required: true },
}, { timestamps: true });

export const createArticlesDataAccess = () => mongoose.model(ARTICLE_REF, ArticleSchema);
export type ArticlesDataAccess = ReturnType<typeof createArticlesDataAccess>;