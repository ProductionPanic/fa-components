export class EventHandler {
    private listeners: { [key: string]: Function[] } = {};
    constructor() {
        this.listeners = {};
    }

    public on(event: string, callback: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    public off(event: string, callback: Function) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }

    public emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach((cb) => cb(...args));
    }

    public once<T>(event: string) {
        return new Promise((resolve) => {
            const wrapper = (arg: T) => {
                resolve(arg);
                this.off(event, wrapper);
            }
            this.on(event, wrapper);
        });
    }


}