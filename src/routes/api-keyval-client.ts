import { guidShort, IHash } from "../utils";
// import { handleError, handleJsonResponse } from "./api-utils";
import { log } from "./utils-browser";

export const handleError = (response: Response, additionalInfo?: string): void => {
    if (!response.ok) {
        const msg = `${response.status} ${response.statusText}${additionalInfo ? ": " + additionalInfo : ""}`;
        log("Error:", msg);
        throw Error(msg);
    }
};

export const handleJsonResponse = (response: Response, additionalInfo?: string) => {
    handleError(response, additionalInfo);
    return response.json();
};

export const sendJson = (url: string, data: any, method: "PUT" | "POST" = "POST", additionalInfo?: string) => {
    return fetch(url, {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        method,
    }).then((response) => handleJsonResponse(response, additionalInfo));
};

export const createApi = <T extends { id: string }>(endpointUrl: string) => {
    const getAll = (): Promise<IHash<T>> => {
        return fetch(endpointUrl).then(handleJsonResponse);
    };

    const getItem = (id: string): Promise<T> => {
        return fetch(`${endpointUrl}/${id}`).then((response) => handleJsonResponse(response, `id=${id}`));
    };

    const putItem = (item: T): Promise<T> => {
        item.id = item.id || guidShort();
        return fetch(`${endpointUrl}/${item.id}`, {
            body: JSON.stringify(item),
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
        }).then((response) => handleJsonResponse(response, `id=${item.id}`));
    };

    const deleteItem = (item: T): Promise<void> => {
        return fetch(`${endpointUrl}/${item.id}`, {
            method: "DELETE",
        }).then((response) => handleError(response, `id=${item.id}`));
    };

    return {
        deleteItem,
        getAll,
        getItem,
        putItem,
    };
};
