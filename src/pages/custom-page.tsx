import React, { useState } from 'react';

import { gql, useQuery, useSubscription } from '@apollo/client';
import { Box, Card, Container, CssBaseline, List, ListItem, ListItemText, ThemeProvider, createTheme } from '@mui/material';
import PowerPanel from '../components/powerpanel';

const GET_POWER = gql`
  query {
  group(id:"EmonTX") {
  
      members {
   
        name
        type

        state {
          state
        }
    }
    
  }
}
`;

const POWER_CHANGED = gql`
  subscription {

    group(id: "EmonTX") {
       
        ... on ItemStateChangedEvent {
            item {
                name
            }
            newState {
                state
            }
        }
       
    }
  }
`;



export function CustomPage() {

  const dd = useQuery(GET_POWER, { onCompleted(data) {
    const entries = new Map();

    data.group.members.forEach( (it:any) =>  {
        entries.set( it.name, it.state.state);
  });
  setState( entries );
  setItems( calc(entries) );
}});

    function calc(data:Map<string,any>) {
        var fb1 = Number(data.get("CurrentFB1"));
          var pv = Number(data.get("CurrentPV"));

          var generate = pv;
          var grid = Number(data.get("Current3"));
          var _export = grid<0?-grid:0;
          var _import = grid>0?grid:0;

          var inUse = generate - _export + _import;
          var solarIn = generate - _export;
          var inUseFlat = Number(data.get("Current2"));
          var inUseHouse = inUse - inUseFlat;

          var spill = inUseHouse - fb1;

          var fb2 = spill/2;
          var fb3 = spill/2;

          
          var electric = {
              solar: {
                  generate: pv,
                  export: _export,
                  consume: solarIn
              },
              grid: {
                  import: grid>0?grid:0,
                  export: grid<0?-grid:0
              },
              location: {
                  use: inUse,
                  flat: { 
                      use: inUseFlat
                  },
                  house: {
                      use: inUseHouse,
                      fuseboxes: [
                          { use: fb1},
                          { use: fb2},
                          { use: fb3}
                      ],
                      smartplugs: [
                          { use: Number(data.get("SmartPlug1_Power"))},
                          { use: Number(data.get("SmartPlug2_Power"))},
                          { use: Number(data.get("SmartPlug3_Power"))},
                      ]
                  }
              }
          };

          return electric;
    }
  

  const [items, setItems] = useState<any>(calc(new Map()));

    const [state, setState] = useState<Map<string,any>>(new Map());

  const { data, loading } = useSubscription(POWER_CHANGED, {
    onData: ({ data }) => {
      
      if( data.data.group.__typename === "ItemStateChangedEvent") {
      const name = data.data.group.item.name;
      const value = data.data.group.newState.state;

      const entries = new Map(state);
      entries.set(name,value);

      setState( entries );
     
      setItems( calc(entries) );
      }
    }
  })
  return (
    
          <Container>
            
            <h1>Power</h1>
            { items && <PowerPanel view={items}></PowerPanel> }
          
          </Container>
       
  );
}


