const { TodoList } = require ("../FakeData")
const _= require("lodash");
const { UserInputError } = require("apollo-server");

const resolvers = {
    Query: {
        todos: () => {
            return TodoList;
        },
        todo: (parent, args) => {
            const id = args.id;
            const todo= _.find(TodoList, { id: Number(id) });
            return todo;
        },
    },
    Mutation: {
    createTodo: (parent, args) => {
        const todo = args.input;
        const lastId = TodoList[TodoList.length-1].id;
        todo.id=lastId+1
        TodoList.push(todo);
        return todo;
    },

    updateTC: (parent, args) => {
        const {id, Newcategory}= args.input
        let todoUpdated
        TodoList.forEach((todo) => {
            if (todo.id===Number(id)) {
                todo.category= Newcategory;
                todoUpdated=todo
            }
        });

        return todoUpdated
    }
    }
};
module.exports = { resolvers };