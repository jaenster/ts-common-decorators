export type CachedSettings = { uniquePerKey?: boolean };

export function Cached(settings: CachedSettings = {}) {
    settings = Object.assign({}, Cached.defaultSettings, settings);
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        // Symbols to store cached information
        let isCached = Symbol('isCached-' + propertyKey),
            cache = Symbol('Cache-' + propertyKey);

        ((origin: Function) => descriptor.value = function (...args) {

            // Define cache objects
            [isCached, cache].filter(symbol => typeof this[symbol] !== 'object').forEach(symbol => this[symbol] = {});

            const property = settings.uniquePerKey ? JSON.stringify(args) : '';

            this[isCached][property] = this[isCached][property]
                || (this[cache][property] = origin.apply(this, args))
                || /* in case of false return*/ true;

            return this[cache][property];
        })(descriptor.value);

        return descriptor;
    }
}

Cached.defaultSettings = {uniquePerKey: true};

export function Static(constructor: any) {
    const child: any = class extends constructor {
        constructor() {// super call will not execute, yet it will be tested @ line coverage
            throw new Error('Cant call new on static') || super();
        }
    };
    return child;
}

export type AnyObject = { [data: string]: any, [data: number]: any };
interface MetaDataGetter {
    get(target:any): AnyObject;
}
export type Metadata = (metadata?: AnyObject) => ((target: any, propertyKey?: string, descriptor?: PropertyDescriptor | undefined) => PropertyDescriptor | void);
export const MetaData: Metadata&MetaDataGetter = ((function () {

    const metaDataKey = Symbol('MetaData');
    const MetaData = function (metadata: AnyObject={}) {
        return function (target: any, propertyKey?: string | number | symbol, descriptor?: PropertyDescriptor | undefined): PropertyDescriptor | void {
            const on = typeof propertyKey !== 'undefined' ? target[propertyKey] : target;
            if (!on.hasOwnProperty(metaDataKey)) on[metaDataKey] = {};
            Object.assign(on[metaDataKey], metadata)
            return descriptor;
        }
    };
    MetaData.get = (target: any): AnyObject => Object.assign({}, target && target.hasOwnProperty(metaDataKey) && target[metaDataKey] || {});
    return MetaData;
}))();