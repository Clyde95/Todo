import React, { useState } from "react";
import {  useQuery, useLazyQuery, useMutation } from '@apollo/client';
import {gql} from 'apollo-boost'
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add"
import { Container } from "@material-ui/core";
import Typography from '@mui/material/Typography';
import { Divider } from "@material-ui/core";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Popup from "./Popup";
import LoopIcon from "@material-ui/icons/Loop"
import MenuItem from '@mui/material/MenuItem';
import { Autocomplete } from "@mui/material";

    
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

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
          label: 'The Lord of the Rings: The Return of the King',
          year: 2003,
        },
        { label: 'The Good, the Bad and the Ugly', year: 1966 },
        { label: 'Fight Club', year: 1999 },
        {
          label: 'The Lord of the Rings: The Fellowship of the Ring',
          year: 2001,
        },
        {
          label: 'Star Wars: Episode V - The Empire Strikes Back',
          year: 1980,
        },
        { label: 'Forrest Gump', year: 1994 },
        { label: 'Inception', year: 2010 },
        {
          label: 'The Lord of the Rings: The Two Towers',
          year: 2002,
        },
        { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { label: 'Goodfellas', year: 1990 },
        { label: 'The Matrix', year: 1999 },
        { label: 'Seven Samurai', year: 1954 },
        {
          label: 'Star Wars: Episode IV - A New Hope',
          year: 1977,
        },
        { label: 'City of God', year: 2002 },
        { label: 'Se7en', year: 1995 },
        { label: 'The Silence of the Lambs', year: 1991 },
        { label: "It's a Wonderful Life", year: 1946 },
        { label: 'Life Is Beautiful', year: 1997 },
        { label: 'The Usual Suspects', year: 1995 },
        { label: 'Léon: The Professional', year: 1994 },
        { label: 'Spirited Away', year: 2001 },
        { label: 'Saving Private Ryan', year: 1998 },
        { label: 'Once Upon a Time in the West', year: 1968 },
        { label: 'American History X', year: 1998 },
        { label: 'Interstellar', year: 2014 },
        { label: 'Casablanca', year: 1942 },
        { label: 'City Lights', year: 1931 },
        { label: 'Psycho', year: 1960 },
        { label: 'The Green Mile', year: 1999 },
        { label: 'The Intouchables', year: 2011 },
        { label: 'Modern Times', year: 1936 },
        { label: 'Raiders of the Lost Ark', year: 1981 },
        { label: 'Rear Window', year: 1954 },
        { label: 'The Pianist', year: 2002 },
        { label: 'The Departed', year: 2006 },
        { label: 'Terminator 2: Judgment Day', year: 1991 },
        { label: 'Back to the Future', year: 1985 },
        { label: 'Whiplash', year: 2014 },
        { label: 'Gladiator', year: 2000 },
        { label: 'Memento', year: 2000 },
        { label: 'The Prestige', year: 2006 },
        { label: 'The Lion King', year: 1994 },
        { label: 'Apocalypse Now', year: 1979 },
        { label: 'Alien', year: 1979 },
        { label: 'Sunset Boulevard', year: 1950 },
        {
          label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
          year: 1964,
        },
        { label: 'The Great Dictator', year: 1940 },
        { label: 'Cinema Paradiso', year: 1988 },
        { label: 'The Lives of Others', year: 2006 },
        { label: 'Grave of the Fireflies', year: 1988 },
        { label: 'Paths of Glory', year: 1957 },
        { label: 'Django Unchained', year: 2012 },
        { label: 'The Shining', year: 1980 },
        { label: 'WALL·E', year: 2008 },
        { label: 'American Beauty', year: 1999 },
        { label: 'The Dark Knight Rises', year: 2012 },
        { label: 'Princess Mononoke', year: 1997 },
        { label: 'Aliens', year: 1986 },
        { label: 'Oldboy', year: 2003 },
        { label: 'Once Upon a Time in America', year: 1984 },
        { label: 'Witness for the Prosecution', year: 1957 },
        { label: 'Das Boot', year: 1981 },
        { label: 'Citizen Kane', year: 1941 },
        { label: 'North by Northwest', year: 1959 },
        { label: 'Vertigo', year: 1958 },
        {
          label: 'Star Wars: Episode VI - Return of the Jedi',
          year: 1983,
        },
        { label: 'Reservoir Dogs', year: 1992 },
        { label: 'Braveheart', year: 1995 },
        { label: 'M', year: 1931 },
        { label: 'Requiem for a Dream', year: 2000 },
        { label: 'Amélie', year: 2001 },
        { label: 'A Clockwork Orange', year: 1971 },
        { label: 'Like Stars on Earth', year: 2007 },
        { label: 'Taxi Driver', year: 1976 },
        { label: 'Lawrence of Arabia', year: 1962 },
        { label: 'Double Indemnity', year: 1944 },
        {
          label: 'Eternal Sunshine of the Spotless Mind',
          year: 2004,
        },
        { label: 'Amadeus', year: 1984 },
        { label: 'To Kill a Mockingbird', year: 1962 },
        { label: 'Toy Story 3', year: 2010 },
        { label: 'Logan', year: 2017 },
        { label: 'Full Metal Jacket', year: 1987 },
        { label: 'Dangal', year: 2016 },
        { label: 'The Sting', year: 1973 },
        { label: '2001: A Space Odyssey', year: 1968 },
        { label: "Singin' in the Rain", year: 1952 },
        { label: 'Toy Story', year: 1995 },
        { label: 'Bicycle Thieves', year: 1948 },
        { label: 'The Kid', year: 1921 },
        { label: 'Inglourious Basterds', year: 2009 },
        { label: 'Snatch', year: 2000 },
        { label: '3 Idiots', year: 2009 },
        { label: 'Monty Python and the Holy Grail', year: 1975 },
      ];
    const [openPopup, setOpenPopup]= useState(false)
    const {categorySearched, setcategorySearched}= useState("")

    const [open, setOpen] = React.useState(true);

    const [expanded, setExpanded] = React.useState(false);

   // const details= [data.todos.map((todo))]

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
            Cat.push(Dog)

        
        })
            console.log("variable", Cat)

        return (
            <div>
                <div>
                    <Container>
                    <TextField 
                        id="outlined-basic" 
                        label="Enter a Task" 
                        variant="outlined" 
                        required
                        size="small"
                        type="text"  
                        onChange={ (event) => { 
                            setTask(event.target.value);
                        }}
                    />
                    <Autocomplete
                        //disablePortal={true}
                        id="combo-box-demo"
                        options={Cat}
                        getOptionSelected={(option, value) => option.value === value.value}
                        sx={{ width: 300 }}
                        renderInput={(params) =>
                    <TextField 
                        {...params}
                        id="outlined-basic" 
                        required
                        label="Enter category" 
                        variant="outlined" 
                        size="small"
                        type="text" 
                        //placeholder="Enter Category"
                        onChange={ (event) => { 
                            setcategory(event.target.value); }}
                    />}
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
                    <Button 
                        variant="contained" 
                        endIcon={<LoopIcon />} 
                        color="primary"
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
