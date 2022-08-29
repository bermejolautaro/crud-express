import { isValidObjectId, Types } from "mongoose";

export interface IValidId<T> {
    get value(): T;
}

export class MongoDbValidId implements IValidId<Types.ObjectId> {
    private readonly validatedId: Types.ObjectId;

    public constructor(id: string) {
        if(!isValidObjectId(id)) {
            throw new Error('Invalid id');
        } else {
            this.validatedId = new Types.ObjectId(id)
        }
    }

    public get value(): Types.ObjectId {
        return this.validatedId;
    }

    public static tryCreateValidId(id: string): MongoDbValidId | null {
        try {
            return new MongoDbValidId(id);
        } catch (error) {
            return null;
        }
    }

}