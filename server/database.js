
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2');
const cors = require('cors')
require('dotenv').config();

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
    category: String!
    id: Int!
  }

  type Mutation {
    createTodo (input: CreateTodoInput!): Todo
    updateTC(input: updateTCInput!): Todo
    deleteTodo(id: Int!): Todo
  }
`);

const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, async(err, rows) => {
        if (err)
            return reject(err);
        //rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
       resolve(rows )
    });
});

const createTodoDB = (req, sql, args) => new Promise((resolve, reject) => {
  let newId
  req.mysqlDb.query(sql, args, async(err, rows) => {
      if (err)
          return reject(err);
     // rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows)
     newId=rows.insertId
     let newTodo 
    await queryDB(req, "select * from todos where id = ?", newId).then(data => newTodo=data[0])
    resolve(newTodo)
    console.log(newTodo, "newTodo")

  })
});

const updateTodoDB = (req, sql, args) => new Promise((resolve, reject) => {
  let newId
  req.mysqlDb.query(sql, args, async(err, rows) => {
      if (err)
          return reject(err);
      console.log(rows.affectedRows)
     rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows)
     newId=rows.affectedRows
     let updatedTodo 
    await queryDB(req, "select * from todos where id = ?", newId).then(data => updatedTodo=data[0])
    resolve(newTodo)
    console.log(updatedTodo, "updated Todo")

  })
});


const root = {
  todos: (args, req) => queryDB(req, "select * from todos ORDER BY id DESC").then(data => data),
  todo: (args, req) => queryDB(req, "select * from todos where id = ?", [args.id]).then(data => data[0]),
  updateTC: (args, req) => queryDB(req, "UPDATE todos SET category= ?  WHERE id= ?;",  Object.values(args.input))
  .then(data => ({ ...data}) ), 
  createTodo: (args, req) => createTodoDB(req, "insert into todos (Task, category) values(?,?);", Object.values(args.input))
    .then(data => ({ ...data}) ),
  deleteTodo: (args, req) => queryDB(req, "delete from todos where id = ?", [args.id]).then(data => data)
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

app.listen(process.env.PORT || 4000 , () => {

  console.log('Running a GraphQL API server at localhost:4000/graphql');

});

//createTodo (Task: String!, category: String!): Boolean