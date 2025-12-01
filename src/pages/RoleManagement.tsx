import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles, useCreateRole, useDeleteRole } from '@/hooks/useRoles';
import { getAuthorizationRoute } from '@/config/routes';
import { usePortals } from '@/hooks/usePortals';
import { useHasPermission } from '@/hooks/usePermissionCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import type { CreateRoleInput } from '@/api/authorization';

export default function RoleManagement() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateRoleInput>({
    portal_id: 0,
    role: '',
  });

  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: portals } = usePortals();
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();

  // Permission checks
  const canCreateRole = useHasPermission('admin.create-role');
  const canDeleteRole = useHasPermission('admin.remove-permission-from-role'); // or appropriate delete permission
  const canEditRole = useHasPermission('admin.get-all-role'); // Edit typically requires view permission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.portal_id || !formData.role.trim()) {
      return;
    }
    try {
      await createRole.mutateAsync(formData);
      setFormData({
        portal_id: 0,
        role: '',
      });
      setIsCreating(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole.mutateAsync(id);
      } catch {
        // Error handled by hook
      }
    }
  };

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Role Management</h2>
        {canCreateRole && (
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Plus className="h-4 w-4" />
            {isCreating ? 'Cancel' : 'Create Role'}
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Role</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portal_id">Portal *</Label>
                <Select
                  value={formData.portal_id.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      portal_id: Number(value),
                    })
                  }
                  required
                >
                  <SelectTrigger id="portal_id">
                    <SelectValue placeholder="Select a portal" />
                  </SelectTrigger>
                  <SelectContent>
                    {portals?.map((portal) => (
                      <SelectItem key={portal.id} value={portal.id.toString()}>
                        {portal.name || portal.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="e.g., Administrator"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={createRole.isPending}>
                  {createRole.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Role'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({
                      portal_id: 0,
                      role: '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Roles List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles && roles.length > 0 ? (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.id}</TableCell>
                    <TableCell className="font-medium">{role.role}</TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {role.portal?.code || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {role.created_at
                          ? new Date(role.created_at).toLocaleDateString()
                          : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {canEditRole && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(getAuthorizationRoute.roleEdit(role.id))
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {canDeleteRole && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(role.id)}
                            disabled={deleteRole.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No roles found. Create your first role to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
