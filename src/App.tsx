import React from 'react';
import logo from './logo.svg';
import './App.css';
import { gql, useQuery, useSubscription } from '@apollo/client';


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


function App() {

  const dd = useQuery(GET_MESSAGES);
  
  const { data, loading } = useSubscription(MESSAGE_CREATED, {
    onData: ({ data }) => {
      console.log(data.data)
    }
  })
  return (
    <div className="App">
      <header className="App-header">

          <div>{dd?.data?.items?.map( 
            (it:any) => <div>{it.name}</div>
          )}</div>
          <h1>upd</h1>
          <div>
            {JSON.stringify(data)}
          </div>
      </header>
    </div>
  );
}

export default App;
