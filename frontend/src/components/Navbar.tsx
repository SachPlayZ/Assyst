import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserDetails } from "../hooks/useUserDetails"; // Adjust import path as needed

interface NavbarProps {
  userDetails: UserDetails | null;
  isLoading: boolean;
  onLogout: () => void;
}

export default function AuthenticatedNavbar({
  userDetails,
  isLoading,
  onLogout,
}: NavbarProps) {
  // Loading state
  if (isLoading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  // No user details (should not happen due to redirect)
  if (!userDetails) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        {/* User Avatar and Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 2,
          }}
        >
          <Avatar
            alt={userDetails.name}
            src={userDetails.picture}
            sx={{ mr: 1 }}
          />
          <Typography variant="h6" sx={{ mr: 2 }}>
            {userDetails.name}
          </Typography>
        </Box>

        {/* Logout Button */}
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
