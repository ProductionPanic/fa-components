type NestedString = string | NestedString[];

class FaTypeWriterElement extends HTMLElement {
    private content_observer!: MutationObserver;
    private animating: boolean = false;
    private parts: NestedString = [];
    public delay: number = 200;
    public interval: number = 10;
    public reverseInterval: number = 0.5;
    public reverse_on_change: boolean = true;
    private paper!: HTMLElement;
    private root: ShadowRoot;

    private wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    private waitfor(event: string) {
        return new Promise<void>((resolve) => {
            const listener = async () => {
                this.removeEventListener(event as any, listener);
                resolve()
            }
            this.addEventListener(event, listener);
        });
    }


    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (this.content_observer) this.content_observer.disconnect();

        this.content_observer = new MutationObserver(() => {
            this.content_changed();
        });
        this.content_observer.observe(this, { childList: true });
        this.root.innerHTML = "<style>:host{display:inline-block;}</style>";
        this.paper = document.createElement('div');
        this.root.appendChild(this.paper);

        const template = document.createElement('template');
        const slot = document.createElement('slot');
        template.appendChild(slot);
        this.root.appendChild(template);

        this.content_changed();
    }

    private async content_changed() {
        // Check if animation is running
        if (this.animating) {
            this.parts = [];
            await this.waitfor('animationend');
        }
        this.reverse_on_change && await this.backspace();
        const _el = document.createElement('div');
        _el.innerHTML = (this.cloneNode(true) as HTMLElement).innerHTML;
        this.parts = this.parts_from_html(_el);
        this.paper.innerHTML = '';
        await this.wait(this.delay);
        this.run_animation();
    }

    private parts_from_html(_el: HTMLElement): NestedString {
        // all alphanumeric characters spaces punctuation and symbols will be returned in their own array element
        // all other html tags and such will be grouped together to preserve formatting
        const parts: NestedString = [];
        const children = _el.childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent;
                if (text) {
                    parts.push(...text.split(''));
                }
            } else {
                // check if self closing tag
                if (!child.firstChild) {
                    parts.push(child.outerHTML);
                    continue;
                }

                // split content into three parts, before, content, and after
                // before and after will be added to the parts array
                // content will be recursively parsed
                const [before, after] = child.outerHTML.split(child.innerHTML) as [string, string]
                const _parts = this.parts_from_html(child as HTMLElement);
                parts.push([
                    before,
                    after,
                    _parts
                ]);
            }
        }
        return parts;
    }

    private async run_animation() {
        if (this.animating) {
            this.addEventListener('animationend', () => {
                this.run_animation();
            }, { once: true });
            return;
        }
        this.animating = true;

        await this.run([...this.parts], this.paper);
        this.dispatchEvent(new Event('animationend'));
    }

    private async run(arr: NestedString = [], el: HTMLElement) {
        if (arr.length === 0) return;
        const char = arr.slice(0, 1)[0];
        arr = arr.slice(1);
        if (typeof char === 'string') {
            el.innerHTML += char;
            await this.wait(this.interval);
            await this.run(arr, el);
            return;
        }
        const [before, after, _parts] = char as [string, string, NestedString];
        const wrapper = before + after;
        const _el = document.createElement('div');
        _el.innerHTML = wrapper;
        const _wrapper = _el.firstChild as HTMLElement;

        el.insertAdjacentElement('beforeend', _wrapper);
        await this.run([..._parts], _wrapper);
        await this.run(arr, el);
    }

    private async backspace() {
        this.paper.textContent = this.paper.textContent!.slice(0, -1);
        await this.wait(this.interval * this.reverseInterval);
        if (this.paper.textContent.length > 0) {
            await this.backspace();
        }
    }

    disconnectedCallback() {
        this.content_observer.disconnect();
    }

    static get observedAttributes() {
        return ['delay', 'interval'];
    }

    attributeChangedCallback(name: string, _: any, newValue: string) {
        switch (name) {
            case 'delay':
                this.delay = parseInt(newValue);
                break;
            case 'interval':
                if (!newValue) return;
                if (newValue.includes(';')) {
                    const [forward, reverse] = newValue.split(';');
                    this.interval = parseFloat(forward);
                    this.reverseInterval = parseFloat(reverse);
                    this.reverse_on_change = true;
                } else {
                    this.reverse_on_change = false;
                    this.interval = parseFloat(newValue);
                }
                break;
        }
    }

}

customElements.define('fa-typewriter', FaTypeWriterElement);