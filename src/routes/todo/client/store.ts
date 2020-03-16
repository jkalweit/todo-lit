import { IHash } from "../../../utils";
import { createApi, handleJsonResponse, sendJson } from "../../api-keyval-client";
import * as models from "../models";

const todosApi = createApi<models.ITodo>("./api/todo");

export const Actions = {
    Todos: {
        ...todosApi,
    },
};
