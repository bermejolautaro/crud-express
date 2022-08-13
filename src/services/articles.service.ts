import { IArticle } from '@app/interfaces/article.interface';
import { ArticlesRepository } from '@app/models/article.model';
import mongoose from 'mongoose';

export class ArticlesService {

    public constructor(private readonly articleRepository: ArticlesRepository) { }

    public async fetch(): Promise<IArticle[] | string> {
        try {
            return await this.articleRepository.find({}).lean().exec()
        } catch(error) {
            return 'salio todo mal';
        }
    }

    public async find(id: mongoose.Types.ObjectId): Promise<IArticle | null> {
        return await this.articleRepository.findById(id).lean().exec();
    }
    
    public async create(article: IArticle): Promise<IArticle> {
        return await this.articleRepository.create(article);
    }

    public async update(id: mongoose.Types.ObjectId, article: IArticle): Promise<IArticle | null> {
        return await this.articleRepository.findByIdAndUpdate(id, article).lean().exec();
    }

    public async remove(id: mongoose.Types.ObjectId): Promise<IArticle | null> {
        return await this.articleRepository.findByIdAndRemove(id).lean().exec();
    }
}