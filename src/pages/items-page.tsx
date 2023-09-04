import React, { useState } from 'react';

import { gql, useQuery, useSubscription } from '@apollo/client';
import { Box, Card, Container, CssBaseline, List, ListItem, ListItemText, ThemeProvider, createTheme } from '@mui/material';


const GET_MESSAGES = gql`
  query {
    items {
      name
    }
  }
`;


export function ItemsPage() {

  const dd = useQuery(GET_MESSAGES);
  
  return (
    
          <Container>
            
            <h1>Items</h1>

            {dd?.data?.items?.map( 
            (it:any) => <Card key={it.name}>{it.name}</Card>
          )}</Container>
       
  );
}


