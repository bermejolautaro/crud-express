import { NextFunction } from "express";

export class ControllerBase {
    private next: NextFunction | null = null;

    public setNextFunction<TSelf extends this>(next: NextFunction) {
        this.next = next;
        return this as TSelf;
    }

    public getNextFunction(): NextFunction | null {
        return this.next;
    }
}