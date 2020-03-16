import express, { Router } from "express";
import fs from "fs";
import path from "path";
import { IHash } from "./utils";
import { createLog, loadJson } from "./utils-server";

export const createApiEndpoint =
    <T extends { id: string }>(filename: string, name: string = "api"): Router => {

    const log = createLog("Api");
    const router = express.Router();

    const { data: items, save } = loadJson<IHash<T>>(filename, {});
    log("createApiEndpoint", name, filename);

    router.get(`/`, (req, res) => {
        log(`GET ${name}/`);
        res.send(items);
    });

    router.get(`/:id`, (req, res) => {
        const id = req.params.id;
        log(`GET ${name}/:id`, id);
        const item: T = items[id];
        if (item) {
            res.send(item);
        } else {
            const msg = `Cannot find ${name} with id="${id}"`;
            log(msg);
            res.status(404).send(msg);
        }
    });

    router.put(`/:id`, (req, res) => {
        const item: T = req.body;
        log("Put Item", item.id, item);
        if (item) {
            log(`PUT ${name}/:id`, item.id);
            items[item.id] = item;
            res.status(200).send(item);
            save();
        } else {
            log(`PUT ${name}/:id`, "ERROR: No Item");
            res.status(400).send("No item in body of request.");
        }
    });

    router.delete(`/:id`, (req, res) => {
        const id = req.params.id;
        delete items[id];
        log("Delete Item", id);
        res.status(204).send();
        save();
    });

    return router;
};
