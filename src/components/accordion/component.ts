import { component } from "@/decorators/component";
import { state } from "@/decorators/state";
import { FaElement } from "@/lib/FaElement";

@component('fa-accordion')
export class FaAccordionElement extends FaElement {
    static styles = `:host { display: block; } .hidden { display: none; }`;

    @state()
    active: boolean = false;

    @state()
    amount: number = 1;

    protected render() {
        const html = this.html`
            ${this.render_header()}
            ${this.render_content()}    
        `;
        return html;

    }

    private render_header() {
        return this.html` 
            <div on:click=${this.toggle} class="header">
            <slot name="header"></slot>
            </div>
        `;
    }

    // @ts-ignore
    private toggle() {
        this.active = !this.active;
    }

    private double() {
        this.amount = this.amount * 2;
    }

    private render_content() {
        console.log(this.active)
        return this.html`
            <div on:click=${this.double} class="${this.active ? '' : 'hidden'}">
                <slot name="content"></slot>
            </div>
        `.repeat(this.amount);
    }
}