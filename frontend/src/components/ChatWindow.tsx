import React, { useState } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChatContext } from "../context/ChatContext";

const ChatWindow: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const { currentChat, sendQuery, isLoading, lastQueryExtendedSearch } =
    useChatContext();

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      try {
        await sendQuery(inputMessage);
        setInputMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  if (!currentChat) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6">
          Create a new chat or select an existing one
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <List sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {currentChat.messages.map((message) => (
          <ListItem
            key={`${message.role}-${message.content.substring(0, 20)}`}
            sx={{
              justifyContent:
                message.role === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: "70%",
                backgroundColor:
                  message.role === "user"
                    ? (theme) => theme.palette.primary.main
                    : (theme) => theme.palette.background.paper,
                color:
                  message.role === "user"
                    ? (theme) => theme.palette.primary.contrastText
                    : (theme) => theme.palette.text.primary,
              }}
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </Paper>
          </ListItem>
        ))}
      </List>

      {lastQueryExtendedSearch && (
        <Box sx={{ p: 1, textAlign: "center" }}>
          <Chip
            label="Extended Web Search Performed"
            color="secondary"
            variant="outlined"
          />
        </Box>
      )}

      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <TextField
          fullWidth
          variant="outlined"
          value={inputMessage}
          disabled={isLoading}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={isLoading ? "Processing..." : "Type a message..."}
          InputProps={{
            endAdornment: isLoading ? <CircularProgress size={20} /> : null,
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatWindow;
