"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const api_keyval_1 = require("../../api-keyval");
const autoreload_1 = require("../../autoreload");
exports.createRoute = (routeName, io) => {
    const router = express_1.default.Router();
    const publicDir = path_1.default.join(__dirname, "public");
    autoreload_1.watch(publicDir, io.of(`/${routeName}`));
    router.use("/api/todo", api_keyval_1.createApiEndpoint("todos.json", "todo"));
    router.use("/public", express_1.default.static(publicDir));
    router.get([`/`, `/*`], (req, res) => {
        res.sendFile(path_1.default.join(publicDir, "index.html"));
    });
    console.log(`Route "${routeName}" is ready.`);
    return router;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUEwQztBQUMxQyxnREFBd0I7QUFDeEIsaURBQXFEO0FBQ3JELGlEQUF5QztBQUc1QixRQUFBLFdBQVcsR0FBRyxDQUFDLFNBQWlCLEVBQUUsRUFBbUIsRUFBVSxFQUFFO0lBQzFFLE1BQU0sTUFBTSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEMsTUFBTSxTQUFTLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakQsa0JBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6QyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSw4QkFBaUIsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNqRSxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDakMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLFNBQVMsYUFBYSxDQUFDLENBQUM7SUFDOUMsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFDIn0=