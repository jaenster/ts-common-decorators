export function Static(constructor: any) {
    const child: any = class extends constructor {
        constructor() {// super call will not execute, yet it will be tested @ line coverage
            throw new Error('Cant call new on static') || super();
        }
    };
    return child;
}