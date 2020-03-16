export interface IHash<T> { [key: string]: T; }

const s4 = (): string => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

export const guidShort = (): string => {
    // Prepend with letter to ensure parsed as a string and preserve
    // insertion order when calling Object.keys -JDK 12/1/2016
    // http://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
    return "a" + s4() + s4();
};

export const forEach = (obj: any, func: (item: any, key: string) => void): void => {
    if (!obj) {
        return;
    }
    Object.entries(obj).map((i) => {
        func(i[1], i[0] as string);
    });
};

export const toArray = <T>(obj: IHash<T> | T[], sortField?: string, reverse: boolean = false): T[] => {
    let arr = [];
    if (Array.isArray(obj)) {
        arr = obj;
    } else {
        arr = Object.entries(obj || {}).map((i) => i[1]);
    }
    if (sortField) {
        arr.sort((a, b) => {
            const a1 = getProperty(a, sortField);
            const b1 = getProperty(b, sortField);
            if (a1 < b1) {
                return reverse ? 1 : -1;
            } else if (a1 > b1) {
                return reverse ? -1 : 1;
            }
            return 0;
        });
    }
    return arr;
};

export const group = <T>(items: IHash<T> | T[], prop: (x: T) => any | string, groupVals?: string[]) => {
    const groups: IHash<{key: string, items: T[]}> = {};

    if (Array.isArray(groupVals)) {
        groupVals.forEach((groupVal) => {
            groups[groupVal] = { key: groupVal, items: [] };
        });
    }

    toArray(items).forEach((item) => {
        let val;
        if (typeof prop === "function") {
            val = prop(item);
        } else {
            val = getProperty(item, prop);
        }

        if (!groups[val]) {
            groups[val] = { key: val, items: [] };
        }
        groups[val].items.push(item);
    });

    return groups;
};

const getPropertyHelper = (obj: any, split: string[]): any => {
    if (obj == null) {
        return null;
    }
    if (split.length === 1) {
        return obj[split[0]];
    }
    return getPropertyHelper(obj[split[0]], split.slice(1, split.length));
};

export const getProperty = (obj: any, path: string): any => {
    if (!path) {
        return obj;
    }
    return getPropertyHelper(obj, path.split("."));
};

const setPropertyHelper = (obj: any, split: string[], value: any): void => {
    if (obj == null) {
        return;
    }
    if (split.length === 1) {
        obj[split[0]] = value;
    } else {
        setPropertyHelper(obj[split[0]], split.slice(1, split.length), value);
    }
};

export const setProperty = (obj: any, path: string, value: any) => {
    return setPropertyHelper(obj, path.split("."), value);
};

export const round = (value: number, decimals: number = 0): number => {
    // console.log("round", value, value.toFixed(precision), parseFloat(value.toFixed(precision)));
    // return parseFloat(value.toFixed(precision));
    return Number(Math.round((value + "e" + decimals) as any) + "e-" + decimals);
};

export const randomInt = (min: number, max: number): number => {
    // inclusive of min and max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatCurrency = (value: number | string, precision: number = 2, emptyString: string = ""): string => {
    if (value === "") {
        // console.log("val is empty string", value, emptyString);
        if (emptyString != null) {
            return emptyString;
        } else {
            value = 0;
        }
    }
    const valueAsNumber: number = (typeof value === "string") ? parseInt(value, 10) : value;
    if (typeof valueAsNumber !== "number" || isNaN(valueAsNumber)) {
        return emptyString;
    }
    return numberWithCommas(valueAsNumber.toFixed(precision));
};

export const numberWithCommas = (x: number | string): string => {
    if (typeof x === "number") {
        x = x.toString();
    }
    if (typeof x !== "string") {
        return "";
    }
    const split = x.split(".");
    split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return split.join(".");
};

export const deepCopy = <T>(obj: T) => {
    return JSON.parse(JSON.stringify(obj)) as T;
};

export const getTotalFields = <T>(item: T, fields: Array<keyof T>): number => {
    const total = fields.reduce((acc, curr) => ((item[curr] as any) as number) + acc, 0);
    return round(total, 2);
};

export const getTotal = <T>(items: T[] | IHash<T>, fields: Array<keyof T>): number => {
    const total = toArray(items).reduce((acc, curr) => (getTotalFields(curr, fields)) + acc, 0);
    return round(total, 2);
};

export const BuildTypescriptModel = (obj: any) => {
    let str = "";
    Object.entries(obj).sort((a: any, b: any) => a[0] > b[0] ? 1 : 0).forEach((entry) => {
        str += `${entry[0]}: ${typeof entry[1] === "number" ? "number" : "string"};\n`
    });
    return str;
};