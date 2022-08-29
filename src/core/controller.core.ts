import { NextFunction } from "express";

import { ControllerBase } from "@app/core/controller-base.core";

export const setupController = <T extends ControllerBase>(c: T) => {
    return (next: NextFunction) => {
        c.setNextFunction(next);
        return c;
    }
}