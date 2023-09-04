import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { gql, useQuery, useSubscription } from "@apollo/client";
import {
  Box,
  Card,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import {
  MoveToInboxOutlined,
  PowerSettingsNew,
  SettingsOutlined,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AppBar from "@mui/material/AppBar";
import { ItemsPage } from "./pages/items-page";
import { EventsPage } from "./pages/events-page";
import { CustomPage } from "./pages/custom-page";

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

function DashboardContent() {
  const [page, setPage] = React.useState("status");
  const [item, setItem] = React.useState<any>();

  const [open, setOpen] = React.useState(true);

  const [configuration, setConfiguration] = React.useState<any>();

  React.useEffect(() => {
    /*
    fetch(`${Configuration.baseUrl}/housenet/config`)
      .then(res => res.json())
      .then(data => setConfiguration(data));
      */
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  function goto(page: string) {
    setPage(page);
  }

  function selectItem(item: any) {
    console.log("SelectItem ");
    console.log(item);

    setPage(item.type);
    setItem(item);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            OpenHAB
          </Typography>
          {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer variant="temporary" open={open} onClose={toggleDrawer}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={() => goto("items")} key="items">
              <ListItemIcon>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText primary="Items" />
            </ListItemButton>

            <ListItemButton onClick={() => goto("events")} key="events">
              <ListItemIcon>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItemButton>

            <ListItemButton onClick={() => goto("custom")} key="custom">
              <ListItemIcon>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText primary="Custom" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
      </nav>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container
          id="c"
          maxWidth="lg"
          sx={{ mt: 4, mb: 4, flexGrow: 1, overflow: "auto" }}
        >
          {page == "items" && <ItemsPage />}
          {page == "events" && <EventsPage />}
          {page == "custom" && <CustomPage />}
        </Container>
      </Box>
    </Box>
  );
}

export default function App() {
  return <DashboardContent />;
}

function App2() {
  const dd = useQuery(GET_MESSAGES);

  const [events, setEvents] = useState<any[]>([]);

  const { data, loading } = useSubscription(MESSAGE_CREATED, {
    onData: ({ data }) => {
      console.log(data.data);
      setEvents((oldArray) => [...oldArray, data.data]);
    },
  });
  return (
    <Box sx={{ display: "flex" }}>
      <Container>
        {dd?.data?.items?.map((it: any) => (
          <Card key={it.name}>{it.name}</Card>
        ))}
      </Container>
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
    </Box>
  );
}
