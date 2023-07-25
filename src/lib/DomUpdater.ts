import morphdom from "morphdom";

export class DomUpdater {
    private root: HTMLElement;

    constructor(root: HTMLElement) {
        this.root = root;
    }

    public updateDom(html: string|HTMLElement) {
        if(typeof html === "string") {
            html = this.stringToHtml(html);
        }
        
        morphdom(this.root, html);
    }



    private stringToHtml(html: string): HTMLElement {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return doc.body;
    }
} 