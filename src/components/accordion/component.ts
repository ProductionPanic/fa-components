import { component } from "@/decorators/component";
import { state } from "@/decorators/state";
import { FaElement } from "@/lib/FaElement";

@component('fa-accordion')
export class FaAccordionElement extends FaElement {
    static styles = `:host { display: block; } .hidden { display: none; }`;

    @state()
    private active: boolean = false;

    protected render() {
        const html = this.html`
            ${this.render_header()}
            ${this.render_content()}    
        `;
        console.log(html);
        return html;

    }

    private render_header() {
        return this.html` 
            <div on:click={toggle} class="header">
            <slot name="header"></slot>
            </div>
        `;
    }

    // @ts-ignore
    private toggle() {
        this.active = !this.active;
    }

    private render_content() {
        return this.html`
            <div class="${this.active ? '' : 'hidden'}">
                <slot name="content"></slot>
            </div>
        `;
    }

    onInit() {
    }
}