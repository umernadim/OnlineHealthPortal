import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const API_URL = "https://localhost:7224/api/Auth";

  const register = async (form) => {
    const res = await axios.post(`${API_URL}/register`, form);
    return res.data;
  };

  const login = async (form) => {
    const res = await axios.post(`${API_URL}/login`, form);
    const token = res.data.token || res.data.Token;
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    setUser(decoded);

    return decoded;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        logout();
      }
    }
  }, []);

  const forgotPassword = async (email) => {
    const res = await axios.post(`${API_URL}/forgot-password`, { email });
    return res.data;
  };

  const verifyCode = (data) =>
    axios.post(`${API_URL}/verify-code`, data);

  const resetPassword = (data) =>
    axios.post(`${API_URL}/reset-password`, data);


  return (
    <AuthContext.Provider value={{ user, register, login, logout, forgotPassword, verifyCode, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

