import fs from "fs";

export const createLog = (name: string = "App") => {
    return Function.prototype.bind.call(console.log, console, `${name}:`);
};
export const log = createLog(); // A defualt log
export const debug = createLog("DEBUG");

export const loadJson = <T>(filepath: string, defaultData: T) => {

    const getData = () => {
        if (fs.existsSync(filepath)) {
            const d: T = JSON.parse(fs.readFileSync(filepath).toString());
            log(`Loaded JSON from ${filepath}.`);
            return d;
        } else {
            log(`Loading JSON: ${filepath} does not exist, using defaultData.`);
            return JSON.parse(JSON.stringify(defaultData));
        }
    };

    const data: T = getData() as T;

    const save = () => {
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    };

    return { data, save };
};
