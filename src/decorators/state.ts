// state decorator
// triggers a render when the value changes
//
export const val_state = function <T>(target, key) {
    let value = target[key];
    return {
        get: () => value,
        set: (v: T) => {
            value = v;
            target.internal.emit('render');
        },
        enumerable: true,
        configurable: true
    }
}

export function state(): PropertyDecorator {
    return (target, key): void => {

        const state = val_state(target, key);
        Reflect.deleteProperty(target, key);
        Reflect.defineProperty(target, key, state);
    }
}