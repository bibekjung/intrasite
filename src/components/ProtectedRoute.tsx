import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { ROUTES } from '@/config/routes';
import { useEffect } from 'react';
import { getAccessRoutes } from '@/api/auth';
import { setAccessRoutes, setIsLoadingAccessRoutes } from '@/slices/authSlice';

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAccessRoutesLoaded, isLoadingAccessRoutes } =
    useSelector((state: RootState) => state.auth);

  // Fetch access routes if user is authenticated but routes aren't loaded
  useEffect(() => {
    if (isAuthenticated && !isAccessRoutesLoaded && !isLoadingAccessRoutes) {
      const fetchRoutes = async () => {
        try {
          dispatch(setIsLoadingAccessRoutes(true));
          const accessRoutes = await getAccessRoutes();
          dispatch(setAccessRoutes(accessRoutes));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to fetch access routes on app load:',
            error instanceof Error ? error.message : String(error),
          );
          // Set loading to false and mark as loaded (even if empty) so app doesn't get stuck
          dispatch(setIsLoadingAccessRoutes(false));
          // Set empty access routes so isAccessRoutesLoaded becomes true
          dispatch(
            setAccessRoutes({
              error: false,
              message: '',
              data: [],
            }),
          );
        }
      };
      fetchRoutes();
    }
  }, [isAuthenticated, isAccessRoutesLoaded, isLoadingAccessRoutes, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
