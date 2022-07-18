const { gql } = require ("apollo-server");

const typeDefs = gql `
    type Todo {
        id: ID!
        Task: String!
        category: String!
    }

    type Category{
        id: ID!
        name: String!
    }
    
    type Query {
        todos: [Todo!]!
        todo(id: ID!): Todo!
    }

    input updateTCInput {
        id: ID!
        Newcategory: String!
    }
    
    input CreateTodoInput{
        Task: String!
        category: String!
    }

    type Mutation {
        createTodo (input: CreateTodoInput!): Todo
        updateTC(input: updateTCInput!): Todo
    }
`;


module.exports= { typeDefs };
