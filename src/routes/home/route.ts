import express, { Router } from "express";
import path from "path";
// import { createApiEndpoint } from "../../api-keyval";
import { watch } from "../../autoreload";

export const createRoute = (routeName: string, io: SocketIO.Server): Router => {
    const router = express.Router();
    const publicDir = path.join(__dirname, "public");
    watch(publicDir, io.of(`/${routeName}`));

    router.get("/test", (req, res) => {
        res.send("Test24!");
    });

    router.use("/", express.static(publicDir));
    return router;
};
