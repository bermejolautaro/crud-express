import { IArticle } from '@app/interfaces/article.interface';
import { IArticlesRepository } from '@app/repositories/mongodb-articles.repository';
import { IValidId } from '@app/shared/valid-id';

export class ArticlesService {

    public constructor(private readonly articleRepository: IArticlesRepository) { }

    public async fetch(): Promise<IArticle[] | string> {
        return await this.articleRepository.fetch();
    }

    public async find<TId>(id: IValidId<TId>): Promise<IArticle | null> {
        return await this.articleRepository.find(id);
    }
    
    public async create(article: IArticle): Promise<IArticle> {
        return await this.articleRepository.create(article);
    }

    public async update<TId>(id: IValidId<TId>, article: IArticle): Promise<IArticle | null> {
        return await this.articleRepository.update(id, article);
    }

    public async remove<TId>(id: IValidId<TId>): Promise<IArticle | null> {
        return await this.articleRepository.remove(id);
    }
}