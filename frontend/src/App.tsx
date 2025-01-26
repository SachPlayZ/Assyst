import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import ChatPage from "./pages/ChatPage";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import theme from "./themes/glassmorphic";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
