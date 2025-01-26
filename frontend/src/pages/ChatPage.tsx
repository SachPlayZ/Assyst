import { CssBaseline, Box } from "@mui/material";
import React from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { ChatProvider } from "../context/ChatContext";
import AuthenticatedNavbar from "../components/Navbar";
import { useUserDetails } from "../hooks/useUserDetails";

const ChatPage = () => {
  const { userDetails, isLoading, handleLogout } = useUserDetails();

  return (
    <ChatProvider>
      <Box
        sx={{
          display: "flex",
          height: "100vh", // Full viewport height
          overflow: "hidden", // Prevent page-level scrolling
        }}
      >
        {/* Sidebar remains outside of the flex-column container */}
        <Sidebar userDetails={userDetails} />

        {/* Main content area becomes a flex column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflow: "hidden", // Prevent scrolling at this level
          }}
        >
          <AuthenticatedNavbar
            userDetails={userDetails}
            isLoading={isLoading}
            onLogout={handleLogout}
          />

          <CssBaseline />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflow: "hidden", // Ensure no additional scrolling
            }}
          >
            <ChatWindow />
          </Box>
        </Box>
      </Box>
    </ChatProvider>
  );
};

export default ChatPage;
