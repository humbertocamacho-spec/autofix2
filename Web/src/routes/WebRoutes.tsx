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
import SpecialitiesTable from "../pages/dashboard/pages/Specialities";
import TicketsTable from "../pages/dashboard/pages/TicketsCreate";
import PendingTicketsTable from "../pages/dashboard/pages/TicketsList";
import CarBrands from "../pages/dashboard/pages/Brands";
import ClientsTable from "../pages/dashboard/pages/Clients";
import PartnersTable from "../pages/dashboard/pages/Partners";
import AdminsTable from "../pages/dashboard/pages/Admins";
import CertificationsTable from "../pages/dashboard/pages/Certifications";
import MyCarsTable from "../pages/dashboard/pages/MyCars";

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

      <Route path="/dashboard/specialities"
        element={
          <ProtectedRoute permission="read_specialities">
            <SpecialitiesTable />
          </ProtectedRoute>
        }
      />
      <Route path="/tickets/created"
        element={
          <ProtectedRoute permission="read_tickets">
            <TicketsTable />
          </ProtectedRoute>
        }
      />

      <Route path="/tickets/list"
        element={
          <ProtectedRoute permission="read_tickets_pending">
            <PendingTicketsTable />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/brands"
        element={
          <ProtectedRoute permission="read_brands">
            <CarBrands />
          </ProtectedRoute>
        }
      />
       <Route path="/dashboard/clients"
        element={
          <ProtectedRoute permission="read_clients">
            <ClientsTable />
          </ProtectedRoute>
        }
      />
        <Route path="/dashboard/partners"
        element={
          <ProtectedRoute permission="read_partners">
            <PartnersTable />
          </ProtectedRoute>
        }
      />

      <Route path="/dashboard/admins"
        element={
          <ProtectedRoute permission="read_admins">
            <AdminsTable />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/certifications"
        element={
          <ProtectedRoute permission="read_certifications">
            <CertificationsTable />
          </ProtectedRoute>
        }
      />

      <Route path="/dashboard/my-cars"
        element={
          <ProtectedRoute permission="read_cars_clients">
            <MyCarsTable />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
