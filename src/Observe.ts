export function Observe(callback: (this: any, value: any) => void): (target: any, key: string | symbol) => void {
    const innerValue = Symbol('innerValue');

    return function (target: any, key: string | symbol) {

        let descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(target, 'key'),
            described: boolean = !!descriptor;

        (descriptor = descriptor || {}).get = function () {
            return this[innerValue];
        };

        descriptor.set = function (v: any) {
            this[innerValue] = v;
            callback.apply(this, [v]);
        };

        described || Object.defineProperty(target.constructor.prototype, key, descriptor);
    }
}

