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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nid-search" element={<NIDSearch />} />
          <Route path="/directory" element={<UserDirectory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/policies" element={<PolicyDocument />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
