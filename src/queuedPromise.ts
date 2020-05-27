export type QueuedSettings = { uniquePerKey?: boolean };

export function QueuedPromise(settings: QueuedSettings = {}) {
    settings = Object.assign({}, QueuedPromise.defaultSettings, settings);
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {

        // Symbols to store cached information
        const isQueue = Symbol('isQueue-' + propertyKey),
            queue = Symbol('Cache-' + propertyKey),
            noArgs = Symbol('No args'),
            runSymbol = Symbol('run queue');

        ((origin: Function) => descriptor.value = function (...args) {

            // Define queue objects
            [isQueue, queue].filter(symbol => typeof this[symbol] !== 'object').forEach(symbol => this[symbol] = {});

            const parametersUniqueKey = settings.uniquePerKey ? JSON.stringify(args) : noArgs;

            // ensure we have an queue
            if (!this[queue][parametersUniqueKey]) this[queue][parametersUniqueKey] = {queue: [], current: undefined};

            const next = () => {
                const first = this[queue][parametersUniqueKey].queue[0];
                return !first || first[runSymbol]();
            };
            let tmp;
            const ret = new Promise((resolve, reject) => {
                tmp = () => {
                    ret[runSymbol] = () => {
                        // run it
                        origin.apply(this, args)
                            .then(res => resolve(res))
                            .catch(rej => reject(rej))
                            .finally(() => {
                                console.log('removing from queue');
                                this[queue][parametersUniqueKey].queue.shift();
                                next();
                            });
                    };

                    this[queue][parametersUniqueKey].queue.push(ret);
                    const indexOf = this[queue][parametersUniqueKey].queue.indexOf(ret);
                    // First in line, start the queue
                    if (!indexOf) next(); // start the queue
                }
            });
            tmp && tmp();

            return ret;
        })(descriptor.value);

        return descriptor;
    }
}

QueuedPromise.defaultSettings = {uniquePerKey: false};
