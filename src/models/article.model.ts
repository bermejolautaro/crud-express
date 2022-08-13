import mongoose from "mongoose";

export const ARTICLE_REF = 'ARTICLE';

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    author: { type: String, required: true },
    body: { type: String, required: true },
}, { timestamps: true });

export const createArticlesRepository = () => mongoose.model(ARTICLE_REF, ArticleSchema);
export type ArticlesRepository = ReturnType<typeof createArticlesRepository>;