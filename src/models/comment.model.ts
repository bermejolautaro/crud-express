import mongoose, { Schema } from "mongoose";
import { ARTICLE_REF } from "./article.model";

export const COMMENT_REF = 'COMMENT';

const CommentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    body: { type: String, required: true },
    article: { type: Schema.Types.ObjectId, ref: ARTICLE_REF}
}, { timestamps: true });

export const createCommentsRepository = () => mongoose.model(COMMENT_REF, CommentSchema);
export type CommentsRepository = ReturnType<typeof createCommentsRepository>;