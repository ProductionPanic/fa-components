export function attribute(opts: {
    name?: string;
    type?: 'string' | 'boolean' | 'number' | 'object' | 'array';
} = {}) {
    return function (target: any, propertyKey: string) {
        const attrName = propertyKey.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        // add meta data for the faComponent decorator to catch
        target.constructor.observedAttributes = target.constructor.observedAttributes || [];
        target.constructor.observedAttributes.push(attrName);

        target.constructor.attributeLinks = target.constructor.attributeLinks || {};
        target.constructor.attributeLinks[attrName] = [propertyKey, opts.type]
    }
}

export function attrChange(attribute) {
    const merge_unique = (a: string[], b: string[]) => [...new Set([...a, ...b])];
    attribute = attribute.split(',').map(attr => attr.trim());

    return function (target: any, _: string, descriptor: PropertyDescriptor) {
        const attributes = attribute.map(attr => attr.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase());
        target.constructor.observedAttributes = target.constructor.observedAttributes || [];
        target.constructor.observedAttributes = merge_unique(target.constructor.observedAttributes, attributes);
        target.constructor.attributeChangeCallbacks = target.constructor.attributeChangeCallbacks || {};

        for (const attribute of attributes) {
            target.constructor.attributeChangeCallbacks[attribute] = target.constructor.attributeChangeCallbacks[attribute] || [];
            target.constructor.attributeChangeCallbacks[attribute].push(descriptor.value);
        }
    }
} 