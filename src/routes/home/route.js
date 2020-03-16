"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// import { createApiEndpoint } from "../../api-keyval";
const autoreload_1 = require("../../autoreload");
exports.createRoute = (routeName, io) => {
    const router = express_1.default.Router();
    const publicDir = path_1.default.join(__dirname, "public");
    autoreload_1.watch(publicDir, io.of(`/${routeName}`));
    router.get("/test", (req, res) => {
        res.send("Test24!");
    });
    router.use("/", express_1.default.static(publicDir));
    return router;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUEwQztBQUMxQyxnREFBd0I7QUFDeEIsd0RBQXdEO0FBQ3hELGlEQUF5QztBQUU1QixRQUFBLFdBQVcsR0FBRyxDQUFDLFNBQWlCLEVBQUUsRUFBbUIsRUFBVSxFQUFFO0lBQzFFLE1BQU0sTUFBTSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEMsTUFBTSxTQUFTLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakQsa0JBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6QyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMzQyxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMifQ==