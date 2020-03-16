import { Nav } from "../../home/client/nav";
import { autoReload, elementRef, html, log, render  } from "../../utils-browser";
import { Actions } from "./store";
import { Todos } from "./todo";

const routeBase = "/todo";
const nsp = io(routeBase);
autoReload(nsp);

const mainDiv = document.getElementById("mainDiv") as HTMLElement;

const Main = () => html`
    ${Nav}
    <h1>Todo</h1>
    ${Todos()}
`;

page.base(routeBase);
page("/", () => render(Main(), mainDiv));

page("*", (ctx) => {
    log("ERROR: Page Not Found", ctx);
    render(html`<h3>Error [client]: Page Not Found</h3>`, mainDiv);
});
page.start();
