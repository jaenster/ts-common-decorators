export const Logger = (function () {
    function Logger(cb?: Function) {
        return function (target: any, propertyKey?: string | number | symbol, descriptor?: PropertyDescriptor | undefined): PropertyDescriptor | void {
            descriptor.value = ((origin) => {
                return function (...args) {
                    (cb || Logger.defaultLogger)(origin);
                    origin.apply(this, args)
                }
            })(descriptor.value)
        }
    }

    Logger.defaultLogger = console.count;
    return Logger;
})();