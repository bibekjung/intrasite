import { useState } from 'react';
import {
  usePortals,
  useCreatePortal,
  useDeletePortal,
} from '@/hooks/usePortals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export default function PortalManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [code, setCode] = useState('');

  const { data: portals, isLoading: portalsLoading } = usePortals();
  const createPortal = useCreatePortal();
  const deletePortal = useDeletePortal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      return;
    }

    try {
      await createPortal.mutateAsync({ code: code.trim() });
      setCode('');
      setIsCreating(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this portal?')) {
      try {
        await deletePortal.mutateAsync(id);
      } catch {
        // Error handled by hook
      }
    }
  };

  if (portalsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Portal Management</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="h-4 w-4" />
          {isCreating ? 'Cancel' : 'Create Portal'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Portal Code *</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., partner, admin, client"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter a unique code for the portal
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createPortal.isPending || !code.trim()}
                >
                  {createPortal.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Portal'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setCode('');
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
          <CardTitle>Portals List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portals && portals.length > 0 ? (
                portals.map((portal) => (
                  <TableRow key={portal.id}>
                    <TableCell className="font-medium">{portal.id}</TableCell>
                    <TableCell className="font-medium">{portal.code}</TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {portal.name || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {portal.created_at
                          ? new Date(portal.created_at).toLocaleDateString()
                          : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(portal.id)}
                          disabled={deletePortal.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                    No portals found. Create your first portal to get started.
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
