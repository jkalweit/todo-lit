"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_browser_1 = require("../../utils-browser");
const nav_1 = require("./nav");
const nsp = io("/");
utils_browser_1.autoReload(nsp);
const Main = () => {
    return utils_browser_1.html `
        ${nav_1.Nav}
        <h1>Home</h1>
    `;
};
const mainDiv = document.getElementById("mainDiv");
utils_browser_1.render(Main(), mainDiv);
/*
page("*", (ctx) => {
    log("ERROR: Page Not Found", ctx);
    render(html`<h3>Error [client]: Page Not Found</h3>`, mainDiv);
});
page.start();
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQXFFO0FBQ3JFLCtCQUE0QjtBQUU1QixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsMEJBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVoQixNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7SUFDZCxPQUFPLG9CQUFJLENBQUE7VUFDTCxTQUFHOztLQUVSLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBZ0IsQ0FBQztBQUNsRSxzQkFBTSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRXhCOzs7Ozs7RUFNRSJ9