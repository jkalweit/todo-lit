import { autoReload, html, log, render  } from "../../utils-browser";
import { Nav } from "./nav";

const nsp = io("/");
autoReload(nsp);

const Main = () => {
    return html`
        ${Nav}
        <h1>Home</h1>
    `;
};

const mainDiv = document.getElementById("mainDiv") as HTMLElement;
render(Main(), mainDiv);

/*
page("*", (ctx) => {
    log("ERROR: Page Not Found", ctx);
    render(html`<h3>Error [client]: Page Not Found</h3>`, mainDiv);
});
page.start();
*/
