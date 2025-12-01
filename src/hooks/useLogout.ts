import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/auth';
import { clearAuth } from '@/slices/authSlice';
import { clearTokens } from '@/utils/tokenStorage';
import { ROUTES } from '@/config/routes';

/**
 * Hook for handling user logout
 * Calls backend API first to destroy session, then clears frontend state
 */
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Step 1: Call backend API to destroy session
      await logout();
    } catch {
      // Even if backend logout fails, we still want to clear frontend state
      // Error is already handled in the logout API function
    } finally {
      // Step 2: Always clear frontend state regardless of backend call result
      dispatch(clearAuth());
      clearTokens();

      // Step 3: Navigate to login page
      navigate(ROUTES.LOGIN);
    }
  };

  return { handleLogout };
};
