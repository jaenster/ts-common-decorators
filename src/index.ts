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