import React, { useState } from "react";

import { gql, useQuery, useSubscription } from "@apollo/client";
import {
  Box,
  Card,
  Container,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  createTheme,
} from "@mui/material";

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

export function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  const { data, loading } = useSubscription(MESSAGE_CREATED, {
    onData: ({ data }) => {
      console.log(data.data);
      setEvents((oldArray) => [...oldArray, data.data]);
    },
  });
  return (
    <Container>
      <h1>Events</h1>

      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: 300,
          "& ul": { padding: 0 },
        }}
      >
        {events.map((it) => (
          <ListItem>
            <ListItemText>{it.events.__typename}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
