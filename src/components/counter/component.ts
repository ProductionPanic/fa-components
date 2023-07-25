import { component } from "@/decorators/component";
import { state } from "@/decorators/state";
import { FaElement } from "@/lib/FaElement";

@component('fa-counter')
export class FaAccordionElement extends FaElement {
    static styles = `:host { display: block; } .hidden { display: none; }`;

    @state() num1: number = 0;
    @state() num2: number = 0;
    @state() result: number = 0;

    render() {
        let cur = this.num1 + this.num2;
        return this.html`
            <div class="counter-1">
                <button on:click=${() => this.num1--}>-</button>
                <span>${this.num1}</span>
                <button on:click=${() => this.num1++}>+</button>
            </div> 
            <div class="counter-2">
                <button on:click=${() => this.num2--}>-</button>
                <span>${this.num2}</span>
                <button on:click=${() => this.num2++}>+</button>
            </div>
            <div class="result">
                <span>${cur}</span>
            </div>

        `;
    }
}