export type PromiseOnceSettings = { uniquePerKey?: boolean };

export function PromiseOnce(settings: PromiseOnceSettings = {}) {
    settings = Object.assign({}, PromiseOnce.defaultSettings, settings);
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        let PromiseSym = Symbol('PromiseOnce');

        ((origin: Function) => descriptor.value = function (...args) {

            // Define cache objects
            [PromiseSym].filter(symbol => typeof this[propertyKey][symbol] !== 'object').forEach(symbol => this[propertyKey][symbol] = {});

            const property = settings.uniquePerKey ? JSON.stringify(args) : '';

            if (
                this[propertyKey][PromiseSym][property] && // Its something
                this[propertyKey][PromiseSym][property] instanceof Promise // its a promise
            ) {
                return this[propertyKey][PromiseSym][property]; // return the promise once value
            }

            // fetch the promise of the function
            const promise: Promise<any> = this[propertyKey][PromiseSym][property] = origin.apply(this, args);

            // Check if its an promise for real
            promise instanceof Promise && promise.then(() => delete this[propertyKey][PromiseSym][property], () => delete this[propertyKey][PromiseSym][property])


            // Promise or not, lets return the value
            return promise;
        })(descriptor.value);

        return descriptor;
    }
}

PromiseOnce.defaultSettings = {uniquePerKey: true};
