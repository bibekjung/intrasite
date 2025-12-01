import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ROUTES } from '@/config/routes';

export function BreadcrumbNav() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map route paths to display names
  const routeMap: Record<string, string> = {
    dashboard: 'Dashboard',
    'nid-search': 'NID Search',
    directory: 'User Directory',
    users: 'Users',
    settings: 'Settings',
    policies: 'Policy Documents',
    profile: 'Profile',
    'reset-password': 'Reset Password',
    authorization: 'Authorization',
    portals: 'Portals',
    roles: 'Roles',
    permissions: 'Permissions',
    edit: 'Edit',
  };

  const getBreadcrumbName = (path: string): string => {
    return routeMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={ROUTES.DASHBOARD}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.length > 0 && <BreadcrumbSeparator />}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <div key={to} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{getBreadcrumbName(value)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{getBreadcrumbName(value)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
