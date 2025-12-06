import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Overview from "../pages/dashboard/pages/Overview";
import ProtectedRoute from "./ProtectedRoute";

export default function WebRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
