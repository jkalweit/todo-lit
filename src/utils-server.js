"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.createLog = (name = "App") => {
    return Function.prototype.bind.call(console.log, console, `${name}:`);
};
exports.log = exports.createLog(); // A defualt log
exports.debug = exports.createLog("DEBUG");
exports.loadJson = (filepath, defaultData) => {
    const getData = () => {
        if (fs_1.default.existsSync(filepath)) {
            const d = JSON.parse(fs_1.default.readFileSync(filepath).toString());
            exports.log(`Loaded JSON from ${filepath}.`);
            return d;
        }
        else {
            exports.log(`Loading JSON: ${filepath} does not exist, using defaultData.`);
            return JSON.parse(JSON.stringify(defaultData));
        }
    };
    const data = getData();
    const save = () => {
        fs_1.default.writeFileSync(filepath, JSON.stringify(data, null, 2));
    };
    return { data, save };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMtc2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXRpbHMtc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBRVAsUUFBQSxTQUFTLEdBQUcsQ0FBQyxPQUFlLEtBQUssRUFBRSxFQUFFO0lBQzlDLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUMxRSxDQUFDLENBQUM7QUFDVyxRQUFBLEdBQUcsR0FBRyxpQkFBUyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7QUFDbkMsUUFBQSxLQUFLLEdBQUcsaUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUUzQixRQUFBLFFBQVEsR0FBRyxDQUFJLFFBQWdCLEVBQUUsV0FBYyxFQUFFLEVBQUU7SUFFNUQsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO1FBQ2pCLElBQUksWUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QixNQUFNLENBQUMsR0FBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUM5RCxXQUFHLENBQUMsb0JBQW9CLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDckMsT0FBTyxDQUFDLENBQUM7U0FDWjthQUFNO1lBQ0gsV0FBRyxDQUFDLGlCQUFpQixRQUFRLHFDQUFxQyxDQUFDLENBQUM7WUFDcEUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUNsRDtJQUNMLENBQUMsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFNLE9BQU8sRUFBTyxDQUFDO0lBRS9CLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtRQUNkLFlBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQztJQUVGLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDMUIsQ0FBQyxDQUFDIn0=