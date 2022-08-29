import { ControllerBase } from "@app/core/controller-base.core";

export function Controller<T extends { new (...args: any[]): {} }>(constructor: T) {
    for (const propertyName of Object.getOwnPropertyNames(constructor.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, propertyName)!;

        const isMethod = descriptor.value instanceof Function;
        if (!isMethod || propertyName === 'constructor')
            continue;

        const originalMethod = descriptor.value;

        descriptor.value = async function (this: ControllerBase, ...args: any[]) {
            return Promise.resolve(originalMethod.apply(this, args)).catch(this.getNextFunction());
        };

        Object.defineProperty(constructor.prototype, propertyName, descriptor);
    }
  }
   