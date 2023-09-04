import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql, useQuery, useSubscription } from '@apollo/client';
import { Box, Card, Container, CssBaseline, List, ListItem, ListItemText, ThemeProvider, createTheme } from '@mui/material';


const GET_MESSAGES = gql`
  query {
    items {
      name
    }
  }
`;

const MESSAGE_CREATED = gql`
  subscription {
    events {
      topic
      ... on ItemEvent {
        item {
          name
        }
      ... on ItemCommandEvent {
        command
      }
      }
    }
  }
`;

const defaultTheme = createTheme();


function App() {

  const dd = useQuery(GET_MESSAGES);
  
  const [events, setEvents] = useState<any[]>([]);

  const { data, loading } = useSubscription(MESSAGE_CREATED, {
    onData: ({ data }) => {
      console.log(data.data);
      setEvents(oldArray => [...oldArray, data.data]);
    }
  })
  return (

    <ThemeProvider theme={defaultTheme}>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

    

          <Container>{dd?.data?.items?.map( 
            (it:any) => <Card key={it.name}>{it.name}</Card>
          )}</Container>
       <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        '& ul': { padding: 0 },
      }}
     
    >

{events.map(
  it => <ListItem><ListItemText>{it.events.__typename}</ListItemText></ListItem>
)}
</List>

      </Box>
    </ThemeProvider>
  );
}

export default App;
