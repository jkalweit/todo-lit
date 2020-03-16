"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
// import { handleError, handleJsonResponse } from "./api-utils";
const utils_browser_1 = require("./utils-browser");
exports.handleError = (response, additionalInfo) => {
    if (!response.ok) {
        const msg = `${response.status} ${response.statusText}${additionalInfo ? ": " + additionalInfo : ""}`;
        utils_browser_1.log("Error:", msg);
        throw Error(msg);
    }
};
exports.handleJsonResponse = (response, additionalInfo) => {
    exports.handleError(response, additionalInfo);
    return response.json();
};
exports.sendJson = (url, data, method = "POST", additionalInfo) => {
    return fetch(url, {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        method,
    }).then((response) => exports.handleJsonResponse(response, additionalInfo));
};
exports.createApi = (endpointUrl) => {
    const getAll = () => {
        return fetch(endpointUrl).then(exports.handleJsonResponse);
    };
    const getItem = (id) => {
        return fetch(`${endpointUrl}/${id}`).then((response) => exports.handleJsonResponse(response, `id=${id}`));
    };
    const putItem = (item) => {
        item.id = item.id || utils_1.guidShort();
        return fetch(`${endpointUrl}/${item.id}`, {
            body: JSON.stringify(item),
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
        }).then((response) => exports.handleJsonResponse(response, `id=${item.id}`));
    };
    const deleteItem = (item) => {
        return fetch(`${endpointUrl}/${item.id}`, {
            method: "DELETE",
        }).then((response) => exports.handleError(response, `id=${item.id}`));
    };
    return {
        deleteItem,
        getAll,
        getItem,
        putItem,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWtleXZhbC1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGkta2V5dmFsLWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUE0QztBQUM1QyxpRUFBaUU7QUFDakUsbURBQXNDO0FBRXpCLFFBQUEsV0FBVyxHQUFHLENBQUMsUUFBa0IsRUFBRSxjQUF1QixFQUFRLEVBQUU7SUFDN0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7UUFDZCxNQUFNLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3RHLG1CQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0FBQ0wsQ0FBQyxDQUFDO0FBRVcsUUFBQSxrQkFBa0IsR0FBRyxDQUFDLFFBQWtCLEVBQUUsY0FBdUIsRUFBRSxFQUFFO0lBQzlFLG1CQUFXLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNCLENBQUMsQ0FBQztBQUVXLFFBQUEsUUFBUSxHQUFHLENBQUMsR0FBVyxFQUFFLElBQVMsRUFBRSxTQUF5QixNQUFNLEVBQUUsY0FBdUIsRUFBRSxFQUFFO0lBQ3pHLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUNkLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUMxQixPQUFPLEVBQUU7WUFDTCxjQUFjLEVBQUUsa0JBQWtCO1NBQ3JDO1FBQ0QsTUFBTTtLQUNULENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLDBCQUFrQixDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLENBQUMsQ0FBQztBQUVXLFFBQUEsU0FBUyxHQUFHLENBQTJCLFdBQW1CLEVBQUUsRUFBRTtJQUN2RSxNQUFNLE1BQU0sR0FBRyxHQUFzQixFQUFFO1FBQ25DLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBa0IsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQztJQUVGLE1BQU0sT0FBTyxHQUFHLENBQUMsRUFBVSxFQUFjLEVBQUU7UUFDdkMsT0FBTyxLQUFLLENBQUMsR0FBRyxXQUFXLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLDBCQUFrQixDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RyxDQUFDLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxDQUFDLElBQU8sRUFBYyxFQUFFO1FBQ3BDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxpQkFBUyxFQUFFLENBQUM7UUFDakMsT0FBTyxLQUFLLENBQUMsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1lBQ3RDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUU7Z0JBQ0wsY0FBYyxFQUFFLGtCQUFrQjthQUNyQztZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLDBCQUFrQixDQUFDLFFBQVEsRUFBRSxNQUFNLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDO0lBRUYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFPLEVBQWlCLEVBQUU7UUFDMUMsT0FBTyxLQUFLLENBQUMsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxRQUFRO1NBQ25CLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLG1CQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDLENBQUM7SUFFRixPQUFPO1FBQ0gsVUFBVTtRQUNWLE1BQU07UUFDTixPQUFPO1FBQ1AsT0FBTztLQUNWLENBQUM7QUFDTixDQUFDLENBQUMifQ==