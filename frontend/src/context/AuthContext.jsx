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
    if (!token) throw new Error("Token not received");

    const decoded = jwtDecode(token);

    const role =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const name =
      decoded.name ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const id =
      decoded.nameid ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    const userData = { id, name, role };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return userData;
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };


  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          console.log("✅ User restored from localStorage");
        } catch (error) {
          console.error("❌ Invalid user data");
          localStorage.clear();
        }
      }
    };

    initAuth();

    // Multi-tab sync
    window.addEventListener('storage', initAuth);
    return () => window.removeEventListener('storage', initAuth);
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

