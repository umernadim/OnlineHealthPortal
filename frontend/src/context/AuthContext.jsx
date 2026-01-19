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

    const token = res.data.Token || res.data.token;
    const role = res.data.Role || res.data.role;  // ← Backend se direct role

    if (!token) throw new Error("Token not received");

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);  // ← Direct save

    const decoded = jwtDecode(token);
    setUser({ ...decoded, role });

    return {
      token,
      role,
      userId: res.data.UserId
    };
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

  const resendCode = (email) =>
    axios.post(`${API_URL}/resend-code`, { email });


  return (
    <AuthContext.Provider value={{
      user,
      register,
      login,
      logout,
      forgotPassword,
      verifyCode,
      resetPassword,
      resendCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

