import { EventHandler } from "./EventHandler";
import { v4 as uuidv4 } from 'uuid';

export abstract class FaElement extends HTMLElement {
    static styles = ``;
    protected root: ShadowRoot;
    protected internal: EventHandler = new EventHandler();
    private initialized = false;

    constructor() {
        super();
        this.constructor.prototype.internal = this.internal;
        this.root = this.attachShadow({ mode: 'open' });
        this.internal.on('render', () => {
            // get static styles
            const styles = "<style>" + (this.constructor as any).styles + "</style>";
            this.root.innerHTML = this.render() + styles;
            this.rendered();
        });
    }

    private rendered() {

        const slots = this.root.querySelectorAll('slot');
        slots.forEach((slot) => {
            const name = slot.getAttribute('name');
            const temp = this.querySelector(`template[slot="${name}"]`) as HTMLTemplateElement;
            if (!temp) return;
            const content = temp.content.cloneNode(true);
            slot.replaceWith(content);
        });
    }


    protected wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    protected uniqueId = () => uuidv4();

    protected onInit() { }

    async connectedCallback() {
        if (this.initialized) return;
        await this.wait(0);
        this.initialized = true;
        this.onInit();
        this.internal.emit('render');
    }

    protected disconnectedCallback() {
        this.internal.emit('destroy');
    }

    protected emit_external(event: string, ...args: any[]) {
        this.dispatchEvent(new CustomEvent(event, { detail: args }));
    }


    public on(event: string, callback: (...args: any[]) => void) {
        this.addEventListener(event, (e: any) => callback(...e.detail));
    }

    protected html(strings: TemplateStringsArray, ...values: any[]): string {
        let result = '';

        // support for on:click syntax
        // <div on:click={()=>console.log('clicked')}></div>
        // <div on:click={click}></div>


        strings.forEach((string, i) => {
            result += string;
            if (values[i]) result += values[i];
        });


        return result;
    }

    protected abstract render(): string;
}