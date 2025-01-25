import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import ChatPage from "./pages/ChatPage";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
