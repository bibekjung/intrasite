import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import NIDSearch from './pages/NIDSearch';
import UserDirectory from './pages/UserDirectory';
import MainLayout from './components/MainLayout';
import PolicyDocument from './pages/PolicyDocument';
import RoleManagement from './pages/RoleManagement';
import PermissionManagement from './pages/PermissionManagement';
import PortalManagement from './pages/PortalManagement';
import EditRolePermissions from './pages/EditRolePermissions';
import Users from './pages/Users';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ROUTES } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.NID_SEARCH} element={<NIDSearch />} />
            <Route path={ROUTES.DIRECTORY} element={<UserDirectory />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.POLICIES} element={<PolicyDocument />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            <Route
              path={ROUTES.AUTHORIZATION.PORTALS}
              element={<PortalManagement />}
            />
            <Route
              path={ROUTES.AUTHORIZATION.ROLES}
              element={<RoleManagement />}
            />
            <Route
              path={`${ROUTES.AUTHORIZATION.ROLES}/:id/edit`}
              element={<EditRolePermissions />}
            />
            <Route
              path={ROUTES.AUTHORIZATION.PERMISSIONS}
              element={<PermissionManagement />}
            />
            <Route path={ROUTES.USERS} element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
