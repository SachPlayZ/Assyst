import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  CssBaseline,
  Paper,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  // Handle Google OAuth Redirect
  const handleGoogleLogin = () => {
    const callbackUrl = `${window.location.origin}`;
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Best practice: use environment variable
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  // Check for access token in URL on component mount
  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);

    if (isMatch) {
      const accessToken = isMatch[1];
      // Securely store the token in an HTTP-only cookie
      Cookies.set("access_token", accessToken, {
        secure: true, // Only send over HTTPS
        sameSite: "strict", // Protect against CSRF
      });
      setIsLoggedin(true);
    }
  }, []);

  // Redirect to secure page when logged in
  useEffect(() => {
    if (isLoggedin) {
      navigate("/chat");
    }
  }, [isLoggedin, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline /> {/* Normalize CSS */}
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in to Continue
        </Typography>
        <Box sx={{ mt: 3, width: "100%" }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: "#fff",
              color: "rgba(0, 0, 0, 0.87)",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Sign In with Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
