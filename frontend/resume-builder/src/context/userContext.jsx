import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

// Helper to get token from cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Listen for forced logout (e.g., from axios interceptor)
  useEffect(() => {
    const handleLogout = () => clearUser();
    window.addEventListener("forceLogout", handleLogout);

    return () => {
      window.removeEventListener("forceLogout", handleLogout);
    };
  }, []);

  useEffect(() => {
    if (user) return;

    const accessToken = getCookie("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser({ ...response.data, token: accessToken }); // ✅ Include token in context
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    // Set token as a cookie (expires in 7 days)
    document.cookie = `token=${userData.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    // Remove token cookie
    document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
