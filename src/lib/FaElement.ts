import { EventHandler } from "./EventHandler";
import { v4 as uuidv4 } from 'uuid';
import { FaTemplateParser } from "./FaTemplateParser";
import morphdom from "morphdom";


export abstract class FaElement extends HTMLElement {
    static styles = ``;
    private observer: MutationObserver;
    private listened_events: string[] = [];
    protected root: HTMLElement;
    protected internal: EventHandler = new EventHandler();
    private initialized = false;
    constructor() {
        super();
        this.observer = new MutationObserver((mutations) => {
            const added_nodes = mutations.filter((mutation) => mutation.type === 'childList').map((mutation) => mutation.addedNodes);

            for (let node of added_nodes) {
                this.addedNodeMutation(node[0], this);   
            }
        });
            
        this.constructor.prototype.internal = this.internal;
        const shadow =this.attachShadow({ mode: 'open' });
        this.root = document.createElement('div');
        this.observer.observe(this.root, { childList: true, subtree: true, attributes: true });
        shadow.appendChild(this.root);
        this.internal.on('render', () => {
            // get static styles
            this.exec_render();
        });
    }

    private attributeMutation(mutation: MutationRecord) {
        console.log(mutation);
        
        const name = mutation.attributeName;
        const value = mutation.target.getAttribute(name);
        if(name === 'on:click') {
            const method = value.substring(1, -1);
            mutation.target.addEventListener('click', (e) => {           
                // call method
                this[method](e);
            });
            
        }        
    }

    private addedNodeMutation(node, parent?) {
        if(node.nodeType === 1) {
            if(node.hasAttribute('on:click') ) {
                const value = node.getAttribute('on:click');
                const method = value.substring(1, -1);
                const call_method = this[method];

                console.log(parent[method]);
                
                node.addEventListener('click', call_method);
                node.removeAttribute('on:click');
            }
        }
    }



    private exec_render() {
        const styles = "<style>" + (this.constructor as any).styles + "</style>";
        const body = this.render() + styles;
        const newroot = this.root.cloneNode(false) as HTMLElement;
        newroot.innerHTML = body;
        morphdom(this.root, body);
    }




    protected wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    protected uniqueId = (arg:Function) => {
        const arg_string = arg.toString();
        return btoa(arg_string);
    }

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
        // add args to the strings
        return strings.reduce((prev, cur, i) => {
            const matches = cur.match(/\{this.(\w+)\}/);
            if(matches) {
                // replace with value from this
                const value = this[matches[1]];
                return prev + cur.replace(matches[0], value);
            }
            return prev + cur + (args[i] || "");
        }, "");
    }

    protected abstract render(): string;
}