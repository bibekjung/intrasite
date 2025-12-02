import { useState, useMemo, useEffect } from 'react';
import { useUsers, useAssignRolesToUser } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { useHasPermission } from '@/hooks/usePermissionCheck';
import {
  Loader2,
  Users as UsersIcon,
  Mail,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import Modal from '@/components/Modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<(string | number)[]>([]);
  const { data: paginatedData, isLoading, error } = useUsers(currentPage);
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const assignRolesMutation = useAssignRolesToUser();
  const canViewUsers = useHasPermission('admin.get-all-user');

  const users = paginatedData?.data || [];

  // Find the selected user from the users array
  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((user: any) => user.id === selectedUserId) || null;
  }, [selectedUserId, users]);

  // Convert roles to MultiSelect options format
  const roleOptions = useMemo(() => {
    if (!roles) return [];
    return roles.map((role) => ({
      value: role.id,
      label: role.role,
    }));
  }, [roles]);

  // Initialize selected roles when user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.roles) {
      setSelectedRoles(selectedUser.roles.map((role: any) => role.id));
    } else {
      setSelectedRoles([]);
    }
  }, [selectedUser]);

  const handleViewUser = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    setSelectedRoles([]);
  };

  const handleSaveRoles = async () => {
    if (!selectedUserId) return;

    try {
      await assignRolesMutation.mutateAsync({
        user_id: selectedUserId,
        role_id: selectedRoles.map((id) => Number(id)),
      });
      // Optionally close the modal after successful save
      // handleCloseModal();
    } catch (error) {
      return error;
    }
  };

  const pagination = paginatedData
    ? {
        current_page: paginatedData.current_page,
        last_page: paginatedData.last_page,
        from: paginatedData.from,
        to: paginatedData.to,
        total: paginatedData.total,
        per_page: paginatedData.per_page,
        next_page_url: paginatedData.next_page_url,
        prev_page_url: paginatedData.prev_page_url,
      }
    : null;

  if (!canViewUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            You don't have permission to view users.
          </p>
        </div>
      </div>
    );
  }

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
        <p className="text-red-800">Failed to load users: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-gray-600 mt-1">Manage all users in the system</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UsersIcon size={18} />
          <span>
            {pagination
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} Users`
              : `${users.length} Users`}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {user.username}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-muted-foreground">
                            {user.email || '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'inactive'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.status || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.roles && user.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span
                                key={role.id}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                              >
                                {role.role}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-muted-foreground text-sm">
                            {user.last_login_at
                              ? new Date(
                                  user.last_login_at,
                                ).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-sm">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(user.id)}
                          title="View User Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600">
                Users will appear here once they are added to the system.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Page {pagination.current_page} of {pagination.last_page}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!pagination.prev_page_url || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === pagination.last_page ||
                        (page >= pagination.current_page - 1 &&
                          page <= pagination.current_page + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore =
                        index > 0 && array[index - 1] !== page - 1;
                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsisBefore && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={
                              page === pagination.current_page
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            disabled={isLoading}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.last_page, prev + 1),
                    )
                  }
                  disabled={!pagination.next_page_url || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Modal open={isModalOpen} title="User Details" onClose={handleCloseModal}>
        {selectedUser ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">ID</p>
                <p className="font-medium">{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="font-medium">{selectedUser.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{selectedUser.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedUser.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : selectedUser.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedUser.status || 'N/A'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Domain</p>
                <p className="font-medium">{selectedUser.domain || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">GUID</p>
                <p className="font-medium text-xs break-all">
                  {selectedUser.guid || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">LDAP DN</p>
                <p className="font-medium text-xs break-all">
                  {selectedUser.ldap_dn || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Login</p>
                <p className="font-medium">
                  {selectedUser.last_login_at
                    ? new Date(selectedUser.last_login_at).toLocaleString()
                    : 'Never'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Verified</p>
                <p className="font-medium">
                  {selectedUser.email_verified_at
                    ? new Date(
                        selectedUser.email_verified_at,
                      ).toLocaleDateString()
                    : 'Not verified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="font-medium">
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleString()
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Updated At</p>
                <p className="font-medium">
                  {selectedUser.updated_at
                    ? new Date(selectedUser.updated_at).toLocaleString()
                    : '-'}
                </p>
              </div>
            </div>
            <div>
              <Label
                htmlFor="roles-select"
                className="text-sm text-gray-500 mb-2 block"
              >
                Roles
              </Label>
              {rolesLoading ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Loading roles...
                  </span>
                </div>
              ) : (
                <MultiSelect
                  options={roleOptions}
                  selected={selectedRoles}
                  onChange={setSelectedRoles}
                  placeholder="Select roles..."
                  className="w-full"
                />
              )}
              {selectedRoles.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {selectedRoles.length} role
                  {selectedRoles.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            {selectedUser.roles && selectedUser.roles.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Roles</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles.map((role) => (
                    <span
                      key={role.id}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                    >
                      {role.role}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={assignRolesMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRoles}
                disabled={
                  assignRolesMutation.isPending ||
                  !selectedUserId ||
                  rolesLoading
                }
              >
                {assignRolesMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Roles'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">User not found</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
