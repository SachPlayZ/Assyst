import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import { useChatContext } from "../context/ChatContext";

const Sidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat } = useChatContext();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 300,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => createNewChat()}
          sx={{ m: 2, width: "250px" }}
        >
          New Chat
        </Button>
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat._id}
              onClick={() => selectChat(chat._id)}
              component="li"
              // Use the sx prop for selected state styling
              sx={{
                cursor: "pointer",
                backgroundColor:
                  currentChat?._id === chat._id
                    ? "rgba(0, 0, 0, 0.08)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemText primary={chat._id} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
