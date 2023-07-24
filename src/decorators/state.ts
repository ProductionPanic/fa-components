// state decorator
// triggers a render when the value changes
//
export function state() {
    return function (target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this[`_${propertyKey}`];
            },
            set: function (value) {
                this[`_${propertyKey}`] = value;
                console.log(target);

                target.internal.emit('render')
            }
        })

    }
}
