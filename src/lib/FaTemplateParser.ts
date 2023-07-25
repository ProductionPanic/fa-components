import { EventHandler } from "./EventHandler";

export class FaTemplateParser {
    constructor(
        private id_generator: () => string,
        private event_handler: EventHandler,
    ) { }

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
                        arg.bind(parent)
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