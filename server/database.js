
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2');
const cors = require('cors')

const app = express();
app.use(cors())

const schema = buildSchema(`
  type Todo {
    id: Int!
    Task: String!
    category: String!

  }

  type Query {
    todos: [Todo!],
    todo(id: Int!) : Todo!
  }

  input CreateTodoInput{
    Task: String!
    category: String!
  }

  input updateTCInput {
    id: Int!
    Newcategory: String!
  }

  type Mutation {
    createTodo (input: CreateTodoInput!): Todo
    updateTC(input: updateTCInput!): Todo
  }
`);

const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, (err, rows) => {
        if (err)
            return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

const root = {
  todos: (args, req) => queryDB(req, "select * from todos").then(data => data),
  todo: (args, req) => queryDB(req, "select * from todos where id = ?", [args.id]).then(data => data[0]),
  //updateUserInfo: (args, req) => queryDB(req, "update users SET ? where id = ?", [args, args.id]).then(data => data),
  createTodo: (args, req) => queryDB(req, "insert into todos SET ?", args).then(data => data)
  //deleteUser: (args, req) => queryDB(req, "delete from users where id = ?", [args.id]).then(data => data)
};

app.use((req, res, next) => {
  req.mysqlDb = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'clyde955!CK',
    database : 'tododb'
  });
  //req.mysqlDb.connect();
  req.mysqlDb.connect();
  next();
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');

//createTodo (Task: String!, category: String!): Boolean