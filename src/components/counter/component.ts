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
        return this.html `
            <div class="counter-1">
                <button on:click={min} >-</button>
                <span>{this.num1}</span>
                <button on:click={plus}>+</button>
            </div> 
        `;
    }

    min() {
        this.num1--;
    }

    plus() {
        this.num1++;
    }
    
}