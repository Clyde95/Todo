import React, { useState } from "react";
import {  useQuery, useLazyQuery, useMutation } from '@apollo/client';
import {gql} from 'apollo-boost'
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add"
import { Container, createTheme, Grid, ThemeProvider, withTheme } from "@mui/material";
import Typography from '@mui/material/Typography';
import { Divider } from "@material-ui/core";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Popup from "./Popup";
import LoopIcon from "@material-ui/icons/Loop"

import { Autocomplete } from "@mui/material";
import DeleteIcon from "@material-ui/icons/Delete"
import {green, red} from "@material-ui/core/colors"

    
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

const UPDATE_CATEGORY = gql `
    mutation updateTC ($input: updateTCInput!){
        updateTC(input: $input){
            id
            Task
            category
        }
    }
`

const DELETE_TODO = gql `
    mutation deleteTodo($id: Int!){
        deleteTodo(id: $id){
            id
        }
    }
`



function DisplayData () {

    //button styling
    const theme = createTheme ({
        palette: {
            primary: {
                main: red[500],
            },
            secondary: {
                main: green[500]
            }
        }
    })
    
    
    const [openPopup, setOpenPopup]= useState(false)

    //updating category
    const {categorySearched, setcategorySearched}= useState("")

    const [open, setOpen] = React.useState(true);

    const [expanded, setExpanded] = React.useState(false);

   // update category
   const [UpdateTC]= useMutation(UPDATE_CATEGORY)
   const [updateTCID, setUpdateTCID]=useState("")
   const [Newcategory, setUpdateTCC]=useState("")



   //delete todo
    const [deleteTodo]= useMutation(DELETE_TODO)
    const [deleteID, setDeleteTodoID]=useState("")


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClick = () => {
        setOpen(!open);}

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
        var Cat= [];
        data.todos.map((todo) => {
            var Identify= todo.id
            var DoIt= todo.Task
            let Dog= {label: todo.category, id: todo.id};
            if (Cat.indexOf(Dog) === -1) {
                Cat.push(Dog)

            }
            

        
        })
            console.log("variable", Cat)

        return (
            <div>
                <div>
                    <Grid container>
                    <Grid item 
                        sx={50}
                        style={{height: 250, width: 300, marginBottom: 50, borderStyle: "inset"}}>
                    <Typography variant="h6">
                        Create Todo Section
                    </Typography>
                    <TextField 
                        id="outlined-basic" 
                        label="Enter a Task" 
                        variant="outlined" 
                        required
                        style={{marginBottom: 25}}
                        size="medium"
                        type="text"  
                        onChange={ (event) => { 
                            setTask(event.target.value);
                        }}
                    />
                    
                    <Autocomplete
                        className="Autocomplete"
                        //disablePortal={true}
                        style={{marginBottom: 20, marginTop: 15, margin: "auto"}}
                        id="combo-box-demo"
                        options={Cat}
                        getOptionSelected={(option, value) => option.value === value.value}
                        sx={{width: 200}}
                        type="text"              
                        renderInput={(params) =>
                    <TextField 
                        {...params}
                        id="outlined-basic" 
                        required
                        label="Enter category" 
                        variant="outlined" 
                        size="small"
                        type="text"
                        fullWidth 
                        //placeholder="Enter Category"
                        onChange={ (event) => { 
                            setcategory(event.target.value); }}
                    />}
                    />
                    <Button 
                        style={{marginLeft: "auto", marginRight: "auto", marginTop: 20}}
                        variant="contained" 
                        endIcon={<AddIcon />} 
                        color="secondary"
                        onClick={() => {
                            setOpenPopup(true)
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
                    </Button>
                    
                    </Grid>
                    <Grid
                        sx={50}
                        style={{height: 250, width: 300, marginLeft: "auto", borderStyle: "inset"}}>

                    <Typography variant="h6">
                        Delete Todo
                    </Typography>
                    <TextField
                        id="outlined-basic" 
                        label="Enter Delete id" 
                        variant="outlined" 
                        required
                        size="medium"
                        style={{marginBottom: 25}}
                        type="number"  
                        onChange={ (event) => { 
                            setDeleteTodoID(event.target.value);
                        }}
                    />
                    
                    <Button 
                        style={{marginBottom: 15, marginLeft: 15, marginTop: 15}}
                        variant="contained" 
                        endIcon={<DeleteIcon />} 
                        color="primary"
                        onClick={ ()=> 
                        
                        {
                            deleteTodo({
                                variables: {id: Number(deleteID)}
                                
                            })
                            //refetch();
                        }}
                        
                        >Delete todo
                    </Button>
                    
                    </Grid>
                    <Grid
                        sx={50}
                        style={{height: 250, width: 300, marginLeft: "auto", borderStyle: "inset"}}>

                    <Typography variant="h6">
                        Edit the Category
                    </Typography>
                    <TextField
                        id="outlined-basic" 
                        label="Enter id" 
                        variant="outlined" 
                        required
                        size="medium"
                        style={{marginBottom: 25}}
                        type="number"  
                        onChange={ (event) => { 
                            setUpdateTCID(event.target.value);
                        }}
                    />
                    <TextField
                        id="outlined-basic" 
                        label="Enter the new category" 
                        variant="outlined" 
                        required
                        size="medium"
                        type="text"  
                        onChange={ (event) => { 
                            setUpdateTCC(event.target.value);
                        }}
                    />
                    <ThemeProvider theme={theme}>
                    <Button theme={theme}
                        style={{marginBottom: 15, marginLeft: 15, marginTop: 15}}
                        variant="contained" 
                        endIcon={<LoopIcon />} 
                        color="secondary"
                        onClick={ ()=> {
                            
                            UpdateTC({
                                variables: 
                                {input: { id: Number(updateTCID), category: Newcategory}
                                 }
                            })
                            
                            }}
                            
                    >Edit todo
                    </Button>
                    </ThemeProvider>
                    
                    </Grid>
                    </Grid>
                    
                    <Button 
                        style={{marginBottom: 15, marginLeft: 15}}
                        variant="contained" 
                        endIcon={<LoopIcon />} 
                        color="secondary"
                        onClick={ ()=> {refetch();}}>Refresh
                    </Button>
                    
                </div>
                {data && 
                data.todos.map((todo) => {
                    var Identify= todo.id
                    var DoIt= todo.Task
                    var Cat= todo.category
                    
                    return (
                        
                        <div>

                            <div>
                                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    ID: {Identify}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>Category: {Cat}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Typography>
                                    Task: {DoIt}
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                
                                </div>
                           
                                
                            
                            <Divider />
                            <Popup
                                title="Create Todo"
                                openPopup={openPopup}
                                setOpenPopup={setOpenPopup}
                                
                            >
                                
                            </Popup>
                        </div>);

                
                
        })} 
        <div>
        {/* <div> 
                    <input type="text" placeholder="What task do you wanna enter?" 
                        onChange={function (event) { setcategorySearched(event.target.value); }} />
                
                    <button onClick={fetchCategory}>Fetch the category</button>
                </div> */}
        </div>
        </div>);

                
    }

export var Identify;
export var  DoIt; 
export var Cat;
export default DisplayData;
