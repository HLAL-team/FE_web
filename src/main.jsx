import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import TopUpPage from "./pages/TopUpPage.jsx";
import TrackerPage from "./pages/TrackerPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <TransferPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/topup"
            element={
              <ProtectedRoute>
                <TopUpPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <TrackerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
