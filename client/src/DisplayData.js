import React, { useState } from "react";
import {  useQuery, useLazyQuery, useMutation } from '@apollo/client';
import {gql} from 'apollo-boost'
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add"
import Modal, { Card, Container } from "@material-ui/core";
import Typography from '@mui/material/Typography';
import Box from "@material-ui/core/Box";
import { CardContent, Divider } from "@material-ui/core";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Popup from "./Popup";

    
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

    const [openPopup, setOpenPopup]= useState(false)
    const {categorySearched, setcategorySearched}= useState("")

    const [open, setOpen] = React.useState(true);

    const [expanded, setExpanded] = React.useState(false);

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
        

        return (
            <div>
                <div>
                    <Container>
                    <TextField 
                        id="outlined-basic" 
                        label="Enter a Task" 
                        variant="outlined" 
                        size="small"
                        type="text"  
                        onChange={ (event) => { 
                            setTask(event.target.value);
                        }}
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="Enter category" 
                        variant="outlined" 
                        size="small"
                        type="text" 
                        //placeholder="Enter Category"
                        onChange={ (event) => { 
                            setcategory(event.target.value); }}
                    />
                    </Container>
                    <Button 
                        variant="contained" 
                        endIcon={<AddIcon />} 
                        color="primary"
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
        <div> 
                    <input type="text" placeholder="What task do you wanna enter?" 
                        onChange={function (event) { setcategorySearched(event.target.value); }} />
                
                    <button onClick={fetchCategory}>Fetch the category</button>
                </div>
        </div>
        </div>);

                
    }

export var Identify;
export var  DoIt; 
export var Cat;
export default DisplayData;
