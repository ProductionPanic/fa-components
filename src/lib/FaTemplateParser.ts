import { EventHandler } from "./EventHandler";

export class FaTemplateParser {
    constructor(
        private event_handler: EventHandler,
    ) { }

    // generate a unique id for an element
    private id_from_element(element:HTMLElement) {
        const t = element.outerHTML.replace(element.innerHTML, "");
        const encoder = new TextEncoder();
        const data = encoder.encode(t);
        const hash = crypto.subtle.digest('SHA-256', data);
        return hash;
    }

    public parse(strings: string[] | TemplateStringsArray, args: any[], parent): string {
        let html = "";
        for (let i = 0; i < strings.length; i++) {
            const cur = strings[i];
            html += cur;
            if (i < strings.length - 1) {
                const arg = args[i] as Function;
                if (html.match(/on:\w+=$/)) {
                    const id = this.id_generator();
                    this.event_handler.on(
                        id,
                        () => arg.call(parent),                      
                    );
                    html += `"${id}"`;
                    html += ' fa:event '
                } else {
                    html += arg;
                }
            }
        }
        return html;
    }
}