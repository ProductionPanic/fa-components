
export function component(options: {
    tag: string
} | string) {
    return function (target: any) {
        const original = target.prototype.connectedCallback;

        target.prototype.connectedCallback = function () {
            original && original.apply(this);

            const self = this;
            const attributeChangeCallbacks = target.attributeChangeCallbacks || {};
            const attributeLinks = target.attributeLinks || {};

            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    // if attribute changed pass it to the attribute and onAttributeChange decorators
                    if (mutation.type === 'attributes') {
                        const name = mutation.attributeName;
                        const oldvalue = mutation.oldValue;
                        const newValue = self.getAttribute(name);
                        const [propertyKey, type] = attributeLinks[name] || [];
                        let typedOldValue;
                        let typedNewValue;
                        if (propertyKey) {
                            if (type === 'boolean') {
                                typedOldValue = oldvalue !== null;
                                typedNewValue = newValue !== null;
                                self[propertyKey] = newValue !== null;
                            } else if (type === 'number') {
                                typedOldValue = parseFloat(oldvalue);
                                typedNewValue = parseFloat(newValue);
                                self[propertyKey] = parseFloat(newValue);
                            } else if (type === 'object') {
                                typedOldValue = JSON.parse(oldvalue);
                                typedNewValue = JSON.parse(newValue);
                                self[propertyKey] = JSON.parse(newValue);
                            } else if (type === 'array') {
                                typedOldValue = JSON.parse(oldvalue);
                                typedNewValue = JSON.parse(newValue);
                                self[propertyKey] = JSON.parse(newValue);
                            } else {
                                typedOldValue = oldvalue;
                                typedNewValue = newValue;
                                self[propertyKey] = newValue;
                            }
                        }
                        const callbacks = attributeChangeCallbacks[name] || [];
                        callbacks.forEach(callback => callback.apply(self, [{ name, oldValue: typedOldValue, newValue: typedNewValue }]));

                    }
                });
            });

            observer.observe(this, { childList: true, attributes: true });
        }

        customElements.define(typeof options === 'string' ? options : options.tag, target);
    }
}
