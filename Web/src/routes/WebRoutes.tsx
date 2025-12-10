import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Overview from "../pages/dashboard/pages/Overview";
import ProtectedRoute from "./ProtectedRoute";
import RolesTable from "../pages/dashboard/pages/Roles";
import UnauthorizedPage from "../pages/dashboard/pages/UnauthorizedPage";
import ModulesTable from "../pages/dashboard/pages/Modules";
import PermissionsTable from "../pages/dashboard/pages/Permissions";
import UsersTable from "../pages/dashboard/pages/Users";

export default function WebRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="/dashboard"
        element={
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        }
      />

      <Route path="/dashboard/roles"
        element={
          <ProtectedRoute permission="read_roles">
            <RolesTable />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/modules"
        element={
          <ProtectedRoute permission="read_modules">
            <ModulesTable />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/permissions"
        element={
          <ProtectedRoute permission="read_permissions">
            <PermissionsTable />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/users"
        element={
          <ProtectedRoute permission="read_users">
            <UsersTable />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
