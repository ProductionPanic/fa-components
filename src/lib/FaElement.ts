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
            const styles = "<style>" + this.constructor.styles + "</style>";
            this.root.innerHTML = this.render() + styles;
            this.rendered();
        });
    }

    private rendered() {
        const on_clicks = this.root.querySelectorAll('[on\\:click]');
        on_clicks.forEach((el) => {
            // const event = el.getAttribute('on:click');
            // console.log(event);

            // if (!event.startsWith('{') || !event.endsWith('}')) throw new Error(`Invalid event ${event}`);
            // const expression = event.slice(1, -1);
            // const fn = new Function('() => ' + expression).call(this);
            // el.addEventListener('click', (e) => fn.call(this, e));

        });

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
        console.log(strings);

        const find = "on:click={";
        // if found walk until closing bracket
        const index = strings[0].indexOf(find);
        if (index !== -1) {
            const start = index + find.length;
            const end = strings[0].indexOf('}', start);
            const expression = strings[0].slice(start, end);
            const fn = new Function('() => ' + expression).call(this);
            result += strings[0].slice(0, index);
            result += `on:click="${fn}"`;
            result += strings[0].slice(end + 1);
            strings = strings.slice(1);
        }



        strings.forEach((string, i) => {
            result += string;
            if (values[i]) result += values[i];
        });


        return result;
    }

    protected abstract render(): string;
}