import { CssBaseline, Box } from "@mui/material";
import React from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { ChatProvider } from "../context/ChatContext";
import AuthenticatedNavbar from "../components/Navbar";
import { useUserDetails } from "../hooks/useUserDetails"; // Adjust import path as needed

const ChatPage = () => {
  const { userDetails, isLoading, handleLogout } = useUserDetails();

  return (
    <>
      <AuthenticatedNavbar
        userDetails={userDetails}
        isLoading={isLoading}
        onLogout={handleLogout}
      />
      <CssBaseline />
      <ChatProvider>
        <Box sx={{ display: "flex" }}>
          <Sidebar userDetails={userDetails} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <ChatWindow />
          </Box>
        </Box>
      </ChatProvider>
    </>
  );
};

export default ChatPage;
