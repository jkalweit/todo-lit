"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("lit-html");
const moment_1 = __importDefault(require("moment"));
exports.moment = moment_1.default;
const utils_1 = require("../utils");
var lit_html_2 = require("lit-html");
exports.html = lit_html_2.html;
exports.render = lit_html_2.render;
exports.TemplateResult = lit_html_2.TemplateResult;
var repeat_1 = require("lit-html/directives/repeat");
exports.repeat = repeat_1.repeat;
// bind and call so the caller's source and line number shows up in devtools -JDK 2020-01-04
// tslint:disable-next-line: no-console
exports.log = Function.prototype.bind.call(console.log, console, "%c App:", "color: green");
// tslint:disable-next-line: no-console
exports.debug = Function.prototype.bind.call(console.log, console, "%c DEBUG:", "color: blue");
exports.autoReload = (socket = io()) => {
    socket.on("reload", () => {
        window.location.reload();
    });
    exports.log("autoReload connected.");
};
exports.Loading = () => lit_html_1.html `
    <h3>Loading...</h3>
`;
exports.Error = (err) => {
    return lit_html_1.html `
        <h3>Error:</h3>
        <p>${err.message}</p>
        <pre>${JSON.stringify(err.stack, null, 2)}</pre>
    `;
};
exports.StringFormatter = {
    inputType: "text",
    parse: (str) => str,
    preferredInputStyle: "width: 100%",
    toString: (value) => value,
};
exports.CurrencyFormatter = {
    inputType: "text",
    parse: (str) => utils_1.round(parseFloat(str.replace("$", "").replace(",", "")), 2),
    preferredInputStyle: "width: 8em; text-align: right;",
    toString: (value) => utils_1.formatCurrency(value),
};
exports.IntegerFormatter = {
    inputType: "text",
    parse: (str) => utils_1.round(parseFloat(str.replace(",", "")), 0),
    preferredInputStyle: "width: 8em; text-align: right;",
    toString: (value) => value.toString(),
};
exports.DateFormatter = {
    inputType: "date",
    parse: (str) => { exports.log("str", str); return moment_1.default(str).format("YYYY-MM-DD"); },
    preferredInputStyle: "width: 8em;",
    toString: (value) => moment_1.default(value).format("YYYY-MM-DD"),
};
exports.TwoWayInput = (model, prop, formatter = exports.StringFormatter, onChanged, isTextArea = false) => {
    let timeout;
    const commit = (e) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        exports.log("e.target", e.target);
        const newValue = e.target.value;
        /*
        const newValue = isTextArea ? (e.target as HTMLTextAreaElement).innerHTML as any
                                    : (e.target as HTMLInputElement).value as any;
        */
        model[prop] = formatter.parse(newValue);
        if (onChanged) {
            onChanged(newValue);
        }
    };
    const onChange = (e) => {
        // Commit immediately
        commit(e);
    };
    const onInput = (e) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            commit(e);
        }, 1000);
    };
    let value = utils_1.getProperty(model, prop);
    value = formatter.toString(value);
    const style = formatter.preferredInputStyle || "";
    if (isTextArea) {
        return lit_html_1.html `
            <textarea style=${style} @input=${onInput} @change=${onChange}>${value}</textarea>
        `;
    }
    else {
        return lit_html_1.html `
            <input type=${formatter.inputType} style=${style} value=${value} @input=${onInput} @change=${onChange} />
        `;
    }
};
exports.Label = (label, content) => {
    return lit_html_1.html `
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
exports.normalizedDate = (date) => moment_1.default(date).format("YYYY-MM-DD");
exports.normalizedDateTime = (date) => moment_1.default(date).toISOString();
exports.formattedDate = (date) => moment_1.default(date).format("MM-DD-YYYY");
exports.formattedDateTime = (date) => moment_1.default(date).format("MM-DD-YYYY h:mma");
exports.elementRef = () => {
    const id = utils_1.guidShort();
    return {
        get: () => document.getElementById(id),
        id,
    };
};
class DateRange {
    constructor() {
        this.endDate = moment_1.default();
        this.startDate = moment_1.default(this.endDate).add(-12, "months");
    }
    render() {
        const startChanged = (e) => this.startDate = moment_1.default(e.target.value);
        const endChanged = (e) => {
            this.endDate = moment_1.default(e.target.value);
        };
        return lit_html_1.html `
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
exports.DateRange = DateRange;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMtYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLWJyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBZ0Q7QUFDaEQsb0RBQTRCO0FBS25CLGlCQUxGLGdCQUFNLENBS0U7QUFKZixvQ0FBeUU7QUFFekUscUNBQXdEO0FBQS9DLDBCQUFBLElBQUksQ0FBQTtBQUFFLDRCQUFBLE1BQU0sQ0FBQTtBQUFFLG9DQUFBLGNBQWMsQ0FBQTtBQUNyQyxxREFBb0Q7QUFBM0MsMEJBQUEsTUFBTSxDQUFBO0FBR2YsNEZBQTRGO0FBQzVGLHVDQUF1QztBQUMxQixRQUFBLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ2pHLHVDQUF1QztBQUMxQixRQUFBLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRXZGLFFBQUEsVUFBVSxHQUFHLENBQUMsU0FBZ0MsRUFBRSxFQUFFLEVBQVEsRUFBRTtJQUNyRSxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDckIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUNILFdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUVXLFFBQUEsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLGVBQUksQ0FBQTs7Q0FFaEMsQ0FBQztBQUVXLFFBQUEsS0FBSyxHQUFHLENBQUMsR0FBVSxFQUFFLEVBQUU7SUFDaEMsT0FBTyxlQUFJLENBQUE7O2FBRUYsR0FBRyxDQUFDLE9B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