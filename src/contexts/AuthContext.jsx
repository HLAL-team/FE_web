import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("auth") === "true";
  });

  const login = (usernameOrEmail, password) => {
    if (usernameOrEmail && password) {
      localStorage.setItem("auth", "true");
      setIsLoggedIn(true);
      return true;
    }
    return false;
    // if (usernameOrEmail !== "admin") return false;
    // if (password !== "admin123") return false;
    // localStorage.setItem("auth", "true");
    // setIsLoggedIn(true);
    // // navigate('/Dashboard');
    // return true;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
