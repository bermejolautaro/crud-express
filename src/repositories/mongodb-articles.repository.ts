import { IArticle } from "@app/interfaces/article.interface";
import { ArticlesDataAccess } from "@app/models/article.model";
import { IValidId, MongoDbValidId } from "@app/shared/valid-id";

export interface IArticlesRepository {
    fetch(): Promise<IArticle[] | string>;
    find<TId>(id: IValidId<TId>): Promise<IArticle | null>;
    create(article: IArticle): Promise<IArticle>;
    update<TId>(id: IValidId<TId>, article: IArticle): Promise<IArticle | null>;
    remove<TId>(id: IValidId<TId>): Promise<IArticle | null>;
}

export class MongoDbArticlesRepository implements IArticlesRepository {
    public constructor(private readonly articlesDataAccess: ArticlesDataAccess) { }

    public async fetch(): Promise<IArticle[] | string> {
        return this.articlesDataAccess.find({}).lean().exec()
    }

    public async find<TId>(id: IValidId<TId>): Promise<IArticle | null> {
        if (!(id instanceof MongoDbValidId)) {
            throw new Error('Invalid Id');
        }

        return this.articlesDataAccess.findById(id.value).lean().exec();
    }

    public async create(article: IArticle): Promise<IArticle> {
        return this.articlesDataAccess.create(article);
    }

    public async update<TId>(id: IValidId<TId>, article: IArticle): Promise<IArticle | null> {
        if (!(id instanceof MongoDbValidId)) {
            throw new Error('Invalid Id');
        }

        return this.articlesDataAccess.findByIdAndUpdate(id.value, article).lean().exec();
    }

    public async remove<TId>(id: IValidId<TId>): Promise<IArticle | null> {
        if (!(id instanceof MongoDbValidId)) {
            throw new Error('Invalid Id');
        }
        
        return this.articlesDataAccess.findByIdAndRemove(id.value).lean().exec();
    }
}