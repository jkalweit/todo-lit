"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const utils_server_1 = require("./utils-server");
const log = utils_server_1.createLog("autoreload");
exports.watch = (clientDir, nsp) => {
    /* Send a signal when file changes */
    chokidar_1.default.watch(clientDir, { depth: 99 }).on("change", (filePath) => {
        if (filePath.match(/bundle\.js$/i) !== null
            || filePath.match(/\.html$/i) !== null
            || filePath.match(/\.css$/i) !== null) {
            log("file changed!", filePath);
            setTimeout(() => nsp.emit("reload"), 100);
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3JlbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1dG9yZWxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFDaEMsaURBQTJDO0FBRTNDLE1BQU0sR0FBRyxHQUFHLHdCQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFdkIsUUFBQSxLQUFLLEdBQUcsQ0FBQyxTQUFpQixFQUFFLEdBQXVCLEVBQUUsRUFBRTtJQUNoRSxxQ0FBcUM7SUFDckMsa0JBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQWdCLEVBQUUsRUFBRTtRQUN2RSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSTtlQUNwQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUk7ZUFDbkMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQ3ZDO1lBQ0UsR0FBRyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvQixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDIn0=