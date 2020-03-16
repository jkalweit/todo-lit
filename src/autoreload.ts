import chokidar from "chokidar";
import { createLog } from "./utils-server";

const log = createLog("autoreload");

export const watch = (clientDir: string, nsp: SocketIO.Namespace) => {
    /* Send a signal when file changes */
    chokidar.watch(clientDir, { depth: 99 }).on("change", (filePath: string) => {
        if (filePath.match(/bundle\.js$/i) !== null
            || filePath.match(/\.html$/i) !== null
            || filePath.match(/\.css$/i) !== null
        ) {
            log("file changed!", filePath);
            setTimeout(() => nsp.emit("reload"), 100);
        }
    });
};
