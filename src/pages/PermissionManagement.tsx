import { usePermissions } from '@/hooks/usePermissions';
import { Loader2, Shield } from 'lucide-react';

export default function PermissionManagement() {
  const { data: permissions, isLoading, error } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Failed to load permissions: {error.message}
        </p>
      </div>
    );
  }

  // Group permissions by module if available
  const groupedPermissions =
    permissions?.reduce(
      (acc, permission) => {
        const module = permission.module || 'Other';
        if (!acc[module]) {
          acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
      },
      {} as Record<string, typeof permissions>,
    ) || {};

  const modules = Object.keys(groupedPermissions);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Permission Management</h2>
          <p className="text-gray-600 mt-1">
            View and manage all available permissions in the system
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield size={18} />
          <span>{permissions?.length || 0} Permissions</span>
        </div>
      </div>

      {modules.length > 0 ? (
        <div className="space-y-6">
          {modules.map((module) => (
            <div key={module} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                  {module}
                </h3>
                <p className="text-sm text-gray-500">
                  {groupedPermissions[module].length} permission(s)
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedPermissions[module].map((permission) => (
                    <div
                      key={permission.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {permission.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {permission.slug}
                          </p>
                          {permission.description && (
                            <p className="text-sm text-gray-600">
                              {permission.description}
                            </p>
                          )}
                        </div>
                        <Shield
                          size={18}
                          className="text-blue-600 flex-shrink-0 ml-2"
                        />
                      </div>
                      {permission.created_at && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400">
                            Created:{' '}
                            {new Date(
                              permission.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Shield size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Permissions Found
          </h3>
          <p className="text-gray-600">
            Permissions will appear here once they are configured in the system.
          </p>
        </div>
      )}

      {/* Alternative table view for non-grouped display */}
      {modules.length === 1 && modules[0] === 'Other' && (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">All Permissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions?.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {permission.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {permission.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {permission.module || 'Other'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
