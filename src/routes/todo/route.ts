import express, { Router } from "express";
import path from "path";
import { createApiEndpoint } from "../../api-keyval";
import { watch } from "../../autoreload";
import { log } from "../../utils-server";

export const createRoute = (routeName: string, io: SocketIO.Server): Router => {
    const router = express.Router();
    const publicDir = path.join(__dirname, "public");
    watch(publicDir, io.of(`/${routeName}`));

    router.use("/api/todo", createApiEndpoint("todos.json", "todo"));
    router.use("/public", express.static(publicDir));
    router.get([`/`, `/*`], (req, res) => {
        res.sendFile(path.join(publicDir, "index.html"));
    });

    console.log(`Route "${routeName}" is ready.`);
    return router;
};
