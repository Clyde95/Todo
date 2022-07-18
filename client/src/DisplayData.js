import React, { useState } from "react";
import {  useQuery, useLazyQuery, useMutation } from '@apollo/client';
import {gql} from 'apollo-boost'
    
const QUERY_ALL_TASKS = gql `
    query GetAllTodos
        {todos {
            id
            Task    
            category
  } 
}
`
const GET_TODO = gql`
    query GetTodo($name: String!) {
        Task
        category
        id
    }
`

const CREATE_TODO_ITEM = gql`
    mutation CreateTodo ($input: CreateTodoInput!) {
    createTodo(input: $input){
        Task
        category
   }
}`


function DisplayData () {
        
    const {categorySearched, setcategorySearched}= useState("")

    //create Todo states
    const [Task, setTask] = useState("");
    const [category, setcategory]= useState("");

    const {data, loading, refetch} = useQuery(QUERY_ALL_TASKS);
    const[
        fetchCategory, 
        {data: categorySearchedData, error: categoryError}]= useLazyQuery( GET_TODO);

        const [createTodo] = useMutation(CREATE_TODO_ITEM)
        if (loading){
            return <h1>loading</h1>
        }
        

        return (
            <div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter a Todo Item" 
                        onChange={ (event) => { 
                            setTask(event.target.value);
                        }}
                    />
                    <input 
                        type="text" 
                        placeholder="Enter Category"
                        onChange={ (event) => { 
                            setcategory(event.target.value); }}
                    />
                    <button onClick={() => {
                        console.log(Task, category)
                        createTodo({ 
                            variables: {
                                input: {Task: Task, category: category},
                            }
                        });
                        refetch();
                    }}
                    >
                        Create Todo Item
                    </button>
                </div>
                {data && 
                data.todos.map((todo) => {
                    return (
                        <div>
                            <h1>Task: {todo.Task}</h1>
                            <h1>Category: {todo.category}</h1>
                            <h1>ID: {todo.id}</h1>
                        </div>)

                
                
        })} 
        <div>
        <div> 
                    <input type="text" placeholder="What task do you wanna enter?" 
                        onChange={function (event) { setcategorySearched(event.target.value); }} />
                
                    <button onClick={fetchCategory}>Fetch the category</button>
                </div>
        </div>
        </div>);

                
    }

export default DisplayData;

// mutation ($Task: String, $category: String){
    //createTodo(Task:$Task, category: $category) {
    //Task
    //category
    //}
  //}