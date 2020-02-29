import {AnyObject} from "./index";

interface MetaDataGetter {
    get(target: any): AnyObject;
}

export type Metadata = (metadata?: AnyObject) => ((target: any, propertyKey?: string, descriptor?: PropertyDescriptor | undefined) => PropertyDescriptor | void);
export const MetaData: Metadata & MetaDataGetter = ((function () {

    const metaDataKey = Symbol('MetaData');
    const MetaData = function (metadata: AnyObject = {}) {
        return function (target: any, propertyKey?: string | number | symbol, descriptor?: PropertyDescriptor | undefined): PropertyDescriptor | void {
            const on = typeof propertyKey !== 'undefined' ? target[propertyKey] : target;
            if (!on.hasOwnProperty(metaDataKey)) on[metaDataKey] = {};
            Object.assign(on[metaDataKey], metadata);
            return descriptor;
        }
    };
    MetaData.get = (target: any): AnyObject => Object.assign({}, target && target.hasOwnProperty(metaDataKey) && target[metaDataKey] || {});
    return MetaData;
}))();