import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export interface UserDetails {
  name: string;
  email: string;
  picture: string;
}

export const useUserDetails = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      // Retrieve access token from cookies
      const accessToken = Cookies.get("access_token");

      // If no token, redirect to login
      if (!accessToken) {
        navigate("/");
        return null;
      }

      // Fetch user details from Google OAuth
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );

      // Handle potential fetch errors
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      // Parse and set user details
      const data = await response.json();
      setUserDetails(data);
      return data;
    } catch (error) {
      console.error("Authentication error:", error);
      // Logout user on any authentication failure
      handleLogout();
      return null;
    } finally {
      // Always stop loading
      setIsLoading(false);
    }
  };

  // Logout functionality
  const handleLogout = () => {
    // Remove access token
    Cookies.remove("access_token");

    // Redirect to login page
    navigate("/");
  };

  // Fetch user details on hook initialization
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return { userDetails, isLoading, handleLogout };
};