import React from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { ChatProvider } from "./context/ChatContext";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ChatProvider>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
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
    </ThemeProvider>
  );
};

export default App;
