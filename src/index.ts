export type Cached = {}; // ToDo; have some settings

export function Cached(settings: Cached = {}) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        // Symbols to store cached information
        let isCached = Symbol('isCached-' + propertyKey),
            cache = Symbol('Cache-' + propertyKey);

        ((origin: Function) => descriptor.value = function (...args) {
            this[isCached] = this[isCached]
                || (this[cache] = origin.apply(this, args))
                || /* incase of false return*/ true;
            return this[cache];
        })(descriptor.value);

        return descriptor;
    }
}

