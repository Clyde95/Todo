import DisplayData from './DisplayData';
import './App.css';
import {ApolloClient, ApolloProvider, InMemoryCache, useQuery} from "@apollo/client"
import { Container, Typography } from '@material-ui/core';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from "@material-ui/icons/Menu"


function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql"
  })
  return (
    <ApolloProvider client={client}>
      <Container maxWidth="md">
      <div className="App">
        <AppBar>
          <Toolbar>
            <IconButton>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6'>
              The Todo App
            </Typography>
          </Toolbar>
        </AppBar>
        <DisplayData />
      </div>
      </Container>
    </ApolloProvider>
  );
}

export default App;
