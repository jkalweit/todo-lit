"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const utils_browser_1 = require("../../utils-browser");
const store_1 = require("./store");
exports.TodosList = (todos) => {
    const deleteTodo = (todo) => {
        store_1.Actions.Todos.deleteItem(todo);
    };
    return utils_browser_1.html `
        ${utils_browser_1.repeat(todos, (x) => x.id, (x) => utils_browser_1.html `
            <div class="row">
                <div class="w4">${utils_browser_1.normalizedDate(x.createdAt)}</div>
                <div class="row-fill">${x.text}</div>
                <button class="w2" @click=${() => deleteTodo(x)}>X</button>
            </div>
        `)}
    `;
};
exports.Todos = () => {
    const NewTodo = () => {
        const inputRef = utils_browser_1.elementRef();
        const addTodo = () => {
            const text = inputRef.get().value;
            store_1.Actions.Todos.putItem({
                createdAt: new Date().toISOString(),
                id: utils_1.guidShort(),
                text,
            }).then((added) => {
                utils_browser_1.log("Added Todo:", added);
                refresh();
            });
        };
        return utils_browser_1.html `
            <div class="row">
                <input class="w10" id=${inputRef.id} />
                <button class="w3" @click=${addTodo}>Add</button>
            </div>
        `;
    };
    const listRef = utils_browser_1.elementRef();
    const refresh = () => {
        store_1.Actions.Todos.getAll().then((todos) => {
            const arr = utils_1.toArray(todos);
            utils_browser_1.render(exports.TodosList(arr), listRef.get());
        });
    };
    refresh();
    return utils_browser_1.html `
        ${NewTodo()}
        <div id=${listRef.id}>
        </div>
    `;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBb0Q7QUFFcEQsdURBQXlHO0FBRXpHLG1DQUFrQztBQUVyQixRQUFBLFNBQVMsR0FBRyxDQUFDLEtBQWMsRUFBRSxFQUFFO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBVyxFQUFFLEVBQUU7UUFDL0IsZUFBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxvQkFBSSxDQUFBO1VBQ0wsc0JBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLG9CQUFJLENBQUE7O2tDQUVkLDhCQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt3Q0FDckIsQ0FBQyxDQUFDLElBQUk7NENBQ0YsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7U0FFdEQsQ0FBQztLQUNMLENBQUM7QUFDTixDQUFDLENBQUM7QUFFVyxRQUFBLEtBQUssR0FBRyxHQUFHLEVBQUU7SUFDdEIsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO1FBQ2pCLE1BQU0sUUFBUSxHQUFHLDBCQUFVLEVBQW9CLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDbEMsZUFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtnQkFDbkMsRUFBRSxFQUFFLGlCQUFTLEVBQUU7Z0JBQ2YsSUFBSTthQUNQLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDZCxtQkFBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxFQUFFLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQUVGLE9BQU8sb0JBQUksQ0FBQTs7d0NBRXFCLFFBQVEsQ0FBQyxFQUFFOzRDQUNQLE9BQU87O1NBRTFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRywwQkFBVSxFQUFFLENBQUM7SUFFN0IsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO1FBQ2pCLGVBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxHQUFHLEdBQUcsZUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLHNCQUFNLENBQUMsaUJBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQztJQUNGLE9BQU8sRUFBRSxDQUFDO0lBRVYsT0FBTyxvQkFBSSxDQUFBO1VBQ0wsT0FBTyxFQUFFO2tCQUNELE9BQU8sQ0FBQyxFQUFFOztLQUV2QixDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=