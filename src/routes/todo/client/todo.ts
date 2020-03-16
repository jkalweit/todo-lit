import { guidShort, toArray } from "../../../utils";
import { Nav } from "../../home/client/nav";
import { autoReload, elementRef, html, log, normalizedDate, render, repeat  } from "../../utils-browser";
import { ITodo } from "../models";
import { Actions } from "./store";

export const TodosList = (todos: ITodo[]) => {
    const deleteTodo = (todo: ITodo) => {
        Actions.Todos.deleteItem(todo);
    };
    return html`
        ${repeat(todos, (x) => x.id, (x) => html`
            <div class="row">
                <div class="w4">${normalizedDate(x.createdAt)}</div>
                <div class="row-fill">${x.text}</div>
                <button class="w2" @click=${() => deleteTodo(x)}>X</button>
            </div>
        `)}
    `;
};

export const Todos = () => {
    const NewTodo = () => {
        const inputRef = elementRef<HTMLInputElement>();
        const addTodo = () => {
            const text = inputRef.get().value;
            Actions.Todos.putItem({
                createdAt: new Date().toISOString(),
                id: guidShort(),
                text,
            }).then((added) => {
                log("Added Todo:", added);
                refresh();
            });
        };

        return html`
            <div class="row">
                <input class="w10" id=${inputRef.id} />
                <button class="w3" @click=${addTodo}>Add</button>
            </div>
        `;
    };

    const listRef = elementRef();

    const refresh = () => {
        Actions.Todos.getAll().then((todos) => {
            const arr = toArray(todos);
            render(TodosList(arr), listRef.get());
        });
    };
    refresh();

    return html`
        ${NewTodo()}
        <div id=${listRef.id}>
        </div>
    `;
};