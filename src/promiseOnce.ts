export type PromiseOnceSettings = { uniquePerKey?: boolean };

export function PromiseOnce(settings: PromiseOnceSettings = {}) {
    settings = Object.assign({}, PromiseOnce.defaultSettings, settings);
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        let PromiseSym = Symbol('PromiseOnce');
        let CounterSym = Symbol('PromiseOnceCounter');
        let emptySym = Symbol('noArguments');
        let counter = 0;
        ((origin: Function) => descriptor.value = function (...args) {

            // Define cache objects
            [PromiseSym].filter(symbol => typeof this[propertyKey][symbol] !== 'object').forEach(symbol => this[propertyKey][symbol] = {});


            // which instance is this?`
            this[CounterSym] = this[CounterSym] || ++counter;
            this[propertyKey][PromiseSym][this[CounterSym]] = this[propertyKey][PromiseSym][this[CounterSym]] || {};


            const property = settings.uniquePerKey ? args.length && JSON.stringify(args) || emptySym : emptySym;

            // we have something cached, and its a promise
            if (this[propertyKey][PromiseSym][this[CounterSym]][property] && this[propertyKey][PromiseSym][this[CounterSym]][property] instanceof Promise) {
                return this[propertyKey][PromiseSym][this[CounterSym]][property]; // return the promise once value
            }

            // fetch the promise of the function
            const promise: Promise<any> = this[propertyKey][PromiseSym][this[CounterSym]][property] = origin.apply(this, args);

            // Check if its an promise for real
            promise instanceof Promise && promise.then(() => delete this[propertyKey][PromiseSym][this[CounterSym]][property], () => delete this[propertyKey][PromiseSym][this[CounterSym]][property])


            // Promise or not, lets return the value
            return promise;
        })(descriptor.value);

        return descriptor;
    }
}

PromiseOnce.defaultSettings = {uniquePerKey: true};
