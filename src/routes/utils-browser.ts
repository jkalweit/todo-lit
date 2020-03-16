import { html, TemplateResult } from "lit-html";
import moment from "moment";
import { formatCurrency, getProperty, guidShort, round } from "../utils";

export { html, render, TemplateResult } from "lit-html";
export { repeat } from "lit-html/directives/repeat";
export { moment };

// bind and call so the caller's source and line number shows up in devtools -JDK 2020-01-04
// tslint:disable-next-line: no-console
export const log = Function.prototype.bind.call(console.log, console, "%c App:", "color: green");
// tslint:disable-next-line: no-console
export const debug = Function.prototype.bind.call(console.log, console, "%c DEBUG:", "color: blue");

export const autoReload = (socket: SocketIOClient.Socket = io()): void => {
    socket.on("reload", () => {
        window.location.reload();
    });
    log("autoReload connected.");
};

export const Loading = () => html`
    <h3>Loading...</h3>
`;

export const Error = (err: Error) => {
    return html`
        <h3>Error:</h3>
        <p>${err.message}</p>
        <pre>${JSON.stringify(err.stack, null, 2)}</pre>
    `;
};

interface IFormatter {
    inputType: "text" | "date" | "number";
    preferredInputStyle?: string;
    parse(str: string): any;
    toString(value: any): string;
}

export const StringFormatter: IFormatter = {
    inputType: "text",
    parse: (str: string) => str,
    preferredInputStyle: "width: 100%",
    toString: (value: string) => value,
};

export const CurrencyFormatter: IFormatter = {
    inputType: "text", // Allow commas and dollar sign
    parse: (str: string) => round(parseFloat(str.replace("$", "").replace(",", "")), 2),
    preferredInputStyle: "width: 8em; text-align: right;",
    toString: (value: string) => formatCurrency(value),
};

export const IntegerFormatter: IFormatter = {
    inputType: "text", // Allow commas
    parse: (str: string) => round(parseFloat(str.replace(",", "")), 0),
    preferredInputStyle: "width: 8em; text-align: right;",
    toString: (value: string) => value.toString(),
};

export const DateFormatter: IFormatter = {
    inputType: "date",
    parse: (str: string) => { log("str", str); return moment(str).format("YYYY-MM-DD"); },
    preferredInputStyle: "width: 8em;",
    toString: (value: string) => moment(value).format("YYYY-MM-DD"),
};

export const TwoWayInput = <T>(model: T,
                               prop: keyof T,
                               formatter: IFormatter = StringFormatter,
                               onChanged?: (newValue: any) => void,
                               isTextArea: boolean = false) => {
    let timeout: NodeJS.Timeout;

    const commit = (e: InputEvent) => {
        if (timeout) { clearTimeout(timeout); }

        log("e.target", e.target);
        const newValue = (e.target as HTMLInputElement).value as any;
        /*
        const newValue = isTextArea ? (e.target as HTMLTextAreaElement).innerHTML as any
                                    : (e.target as HTMLInputElement).value as any;
        */
        model[prop] = formatter.parse(newValue);

        if (onChanged) { onChanged(newValue); }
    };

    const onChange = (e: InputEvent) => {
        // Commit immediately
        commit(e);
    };

    const onInput = (e: InputEvent) => {
        if (timeout) { clearTimeout(timeout); }
        timeout = setTimeout(() => {
            commit(e);
        }, 1000);
    };

    let value = getProperty(model, prop as string);
    value = formatter.toString(value);

    const style = formatter.preferredInputStyle || "";
    if (isTextArea) {
        return html`
            <textarea style=${style} @input=${onInput} @change=${onChange}>${value}</textarea>
        `;
    } else {
        return html`
            <input type=${formatter.inputType} style=${style} value=${value} @input=${onInput} @change=${onChange} />
        `;
    }
};

export const Label = (label: string, content: TemplateResult | string) => {
    return html`
        <div class="row">
            <label class="row-nofill w5">
                ${label}
            </label>
            <div class="row-nofill w10">
                ${content}
            </div>
        </div>
    `;
};

export const normalizedDate = (date?: string | moment.Moment) => moment(date).format("YYYY-MM-DD");
export const normalizedDateTime = (date?: string | moment.Moment) => moment(date).toISOString();
export const formattedDate = (date?: string | moment.Moment) => moment(date).format("MM-DD-YYYY");
export const formattedDateTime = (date?: string | moment.Moment) => moment(date).format("MM-DD-YYYY h:mma");

export const elementRef = <T extends HTMLElement>() => {
    const id = guidShort();
    return {
        get: () => document.getElementById(id) as T,
        id,
    };
};

export class DateRange {
    public startDate: moment.Moment;
    public endDate: moment.Moment;
    constructor() {
        this.endDate = moment();
        this.startDate = moment(this.endDate).add(-12, "months");
    }
    public render() {
        const startChanged = (e: Event) => this.startDate = moment((e.target as HTMLInputElement).value);
        const endChanged = (e: Event) => {
            this.endDate = moment((e.target as HTMLInputElement).value);
        };
        return html`
            <div class="row">
                <span class="w3">Start:</span>
                <input class="w4" value=${this.startDate.format("YYYY-MM-DD")} @change=${startChanged} type="date" />
            </div>
            <div class="row">
                <span class="w3">End:</span>
                <input class="w4" value=${this.endDate.format("YYYY-MM-DD")} @change=${endChanged} type="date" />
            </div>
        `;
    }
}

/*
export interface IInputOptions {
    label?: string;
    type?: "number" | "text" | "date";
    step?: number;
    onChange?: (newValue: any) => void;
    isCurrency?: boolean;
}

export const TwoWayInput = <T>(model: T, prop: keyof T, options: IInputOptions = {}) => {
    let type = options.type || "text";

    let timeout: NodeJS.Timeout;

    const commit = (e: InputEvent) => {
        if (timeout) { clearTimeout(timeout); }

        let newValue = (e.target as HTMLInputElement).value as any;
        if (options.type === "number") { newValue = parseFloat(newValue); }
        if (options.isCurrency) { newValue = round(newValue); }
        model[prop] = newValue;

        if (options.onChange) { options.onChange(newValue); }
    };

    const onChange = (e: InputEvent) => {
        // Commit immediately
        commit(e);
    };

    const onInput = (e: InputEvent) => {
        if (timeout) { clearTimeout(timeout); }
        timeout = setTimeout(() => {
            commit(e);
        }, 1000);
    };

    let value = getProperty(model, prop as string);
    if (options.type === "date") {
        value = moment(value).format("YYYY-MM-DD");
    }
    if (options.isCurrency) {
        type = "number";
        options.step = 0.01;
        value = formatCurrency(value);
    }

    return html`
        <input value=${value} @input=${onInput} @change=${onChange}
        type=${type} step=${options.step || 0.01} />
    `;
};

*/

/*
export class InputGeneric<T> {
    private model: T;
    private prop: keyof T;
    private options: IInputOptions;

    constructor(model: T, prop: keyof T, options: IInputOptions = {}) {
        this.model = model;
        this.prop = prop;
        this.options = options;
    }

    public getModelValue(): string {
        return getProperty(this.model, this.prop as string).toString();
    }

    public parseValue(value: any): { success: boolean; value: any} {
        return { success: true, value };
    }

    public setModelValue(newValue: any) {
        const result = this.parseValue(newValue);
        if (result.success) {
            this.model[this.prop] = result.value;
            log("onInput", newValue);
            if (this.options.onChange) { this.options.onChange(newValue); }
        }
    }

    public render() {
        return html`
            <input value=${this.getModelValue()} @input=${this.onInput.bind(this)} />
        `;
    }

    private onInput(e: InputEvent) {
        const newValue = (e.target as HTMLInputElement).value as any;
        this.setModelValue(newValue);
    }
}

// tslint:disable-next-line: max-classes-per-file
export class InputCurrency<T> extends InputGeneric<T> {
    public getModelValue(): string {
        return "Currency";
    }
}

export const InputCurrency2 = <T>(model: T, prop: keyof T, options: IInputOptions = {}) => {
    let timeout: NodeJS.Timeout;
    const commit = (e: InputEvent) => {
        if (timeout) { clearTimeout(timeout); }

        let newValue = (e.target as HTMLInputElement).value as any;
        newValue = parseFloat(newValue);
        newValue = round(newValue);
        model[prop] = newValue;

        if (options.onChange) { options.onChange(newValue); }
    };

    const onChange = (e: InputEvent) => commit(e);
    const onInput = (e: InputEvent) => {
        if (timeout) { clearTimeout(timeout); }
        timeout = setTimeout(() => {
            commit(e);
        }, 1000);
    };

    const value = formatCurrency(getProperty(model, prop as string));
    const type = "text";

    return html`
        <input value=${value} @input=${onInput} @change=${onChange}
        type=${type} />
    `;
};
*/
