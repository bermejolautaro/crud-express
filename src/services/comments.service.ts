import { IComment } from '@app/interfaces/comment.interface';
import { CommentsRepository } from "@app/models/comment.model";
import { Types } from "mongoose";

export class CommentsService {
    public constructor(private readonly commentsRepository: CommentsRepository) { }

    public async fetch(articleId?: Types.ObjectId) {
        return await this.commentsRepository.find({ article: articleId }).lean().exec();
    }

    public async find(id: Types.ObjectId, articleId?: Types.ObjectId) {
        return await this.commentsRepository.find({ _id: id, article: articleId }).lean().exec();
    }
    
    public async create(comment: IComment) {
        return await this.commentsRepository.create(comment);
    }

    public async update(id: Types.ObjectId, comment: IComment) {
        return await this.commentsRepository.findByIdAndUpdate(id, comment).lean().exec();
    }

    public async remove(id: Types.ObjectId) {
        return await this.commentsRepository.findByIdAndRemove(id).lean().exec();
    }

    public async removeByArticleId(articleId: Types.ObjectId) {
        return await this.commentsRepository.deleteMany({ article: articleId }).lean().exec();
    }
}