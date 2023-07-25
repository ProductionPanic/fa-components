import { EventHandler } from "./EventHandler";
import { v4 as uuidv4 } from 'uuid';
import { FaTemplateParser } from "./FaTemplateParser";

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
            this.exec_render();
        });
    }

    private exec_render() {
        const styles = "<style>" + (this.constructor as any).styles + "</style>";
        const body = this.render() + styles;
        this.root.innerHTML = body;
        this.rendered();
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

        const elements = this.root.querySelectorAll('[fa\\:event]');
        elements.forEach((element) => {
            element.removeAttribute('fa:event');
            const attributes = element.attributes;
            const filtered = Array.from(attributes).filter((attr) => attr.name.startsWith('on:'));
            filtered.forEach((attr) => {
                const event = attr.name.replace('on:', '');
                const id = element.getAttribute(attr.name) + '';
                element.removeAttribute(attr.name);
                element.addEventListener(event, (e) => {
                    this.internal.emit(id, e);
                });
            });
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

    // @ts-ignore
    protected html(strings: TemplateStringsArray, ...args: any[]): string {
        const templateParser = new FaTemplateParser(this.uniqueId, this.internal);
        return templateParser.parse(strings, args, this);
    }

    protected abstract render(): string;
}