import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useRoleWithPermissions,
  useAddPermissionToRole,
} from '@/hooks/useRoles';
import { getAuthorizationRoute } from '@/config/routes';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

export default function EditRolePermissions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = id ? parseInt(id, 10) : 0;

  const { data: roleWithPermissions, isLoading: roleLoading } =
    useRoleWithPermissions(roleId);
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const addPermissionToRole = useAddPermissionToRole();

  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    if (roleWithPermissions) {
      setRoleName(roleWithPermissions.role);
      // Set selected permissions from the API response
      const permissionIds =
        roleWithPermissions.permissions?.map((p) => p.id) || [];
      setSelectedPermissions(permissionIds);
    }
  }, [roleWithPermissions]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSelectAll = () => {
    if (permissions) {
      if (selectedPermissions.length === permissions.length) {
        setSelectedPermissions([]);
      } else {
        setSelectedPermissions(permissions.map((p) => p.id));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) return;

    try {
      await addPermissionToRole.mutateAsync({
        role_id: roleId,
        permission_id: selectedPermissions,
      });
      navigate(getAuthorizationRoute.roles());
    } catch {
      // Error handled by hook
    }
  };

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!roleWithPermissions && !roleLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Role not found</p>
        <Button
          onClick={() => navigate(getAuthorizationRoute.roles())}
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => navigate(getAuthorizationRoute.roles())}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Edit Role Permissions</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                readOnly
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Permissions</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedPermissions.length === permissions?.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions && permissions.length > 0 ? (
                      permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">
                            {permission.action}
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {permission.resources || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {roleLoading ? (
                              <div className="h-4 w-4 shrink-0 rounded-sm border border-primary shadow shimmer" />
                            ) : (
                              <Checkbox
                                checked={selectedPermissions.includes(
                                  permission.id,
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground py-8"
                        >
                          No permissions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={addPermissionToRole.isPending}>
                {addPermissionToRole.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Permissions
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(getAuthorizationRoute.roles())}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
