import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PermissionRoute } from "./PermissionRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { UsersPage } from "../pages/admin/UsersPage";
import { RolesPage } from "../pages/admin/RolesPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { HelpCenterPage } from "../pages/help/HelpCenterPage";
import { NotFoundPage } from "../pages/NotFoundPage";
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="users"
            element={
              <PermissionRoute permission="users.read">
                <UsersPage />
              </PermissionRoute>
            }
          />
          <Route
            path="roles"
            element={
              <PermissionRoute permission="roles.read">
                <RolesPage />
              </PermissionRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PermissionRoute permission="settings.read">
                <SettingsPage />
              </PermissionRoute>
            }
          />
          <Route path="help-center" element={<HelpCenterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
