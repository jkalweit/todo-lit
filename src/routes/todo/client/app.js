"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nav_1 = require("../../home/client/nav");
const utils_browser_1 = require("../../utils-browser");
const todo_1 = require("./todo");
const routeBase = "/todo";
const nsp = io(routeBase);
utils_browser_1.autoReload(nsp);
const mainDiv = document.getElementById("mainDiv");
const Main = () => utils_browser_1.html `
    ${nav_1.Nav}
    <h1>Todo</h1>
    ${todo_1.Todos()}
`;
page.base(routeBase);
page("/", () => utils_browser_1.render(Main(), mainDiv));
page("*", (ctx) => {
    utils_browser_1.log("ERROR: Page Not Found", ctx);
    utils_browser_1.render(utils_browser_1.html `<h3>Error [client]: Page Not Found</h3>`, mainDiv);
});
page.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQTRDO0FBQzVDLHVEQUFpRjtBQUVqRixpQ0FBK0I7QUFFL0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQzFCLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxQiwwQkFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRWhCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFnQixDQUFDO0FBRWxFLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLG9CQUFJLENBQUE7TUFDakIsU0FBRzs7TUFFSCxZQUFLLEVBQUU7Q0FDWixDQUFDO0FBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLHNCQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUV6QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDZCxtQkFBRyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLHNCQUFNLENBQUMsb0JBQUksQ0FBQSx5Q0FBeUMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyJ9