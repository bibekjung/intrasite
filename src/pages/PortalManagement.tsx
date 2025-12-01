import { useState } from 'react';
import {
  usePortals,
  useCreatePortal,
  useDeletePortal,
} from '@/hooks/usePortals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, Projector } from 'lucide-react';

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
        <div>
          <h2 className="text-2xl font-bold">Portal Management</h2>
          <p className="text-gray-600 mt-1">
            Create and manage portals in the system
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          {isCreating ? 'Cancel' : 'Create Portal'}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Projector size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold">Create New Portal</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Portal Code *</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., partner, admin, client"
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a unique code for the portal (e.g., partner, admin)
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createPortal.isPending || !code.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createPortal.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Portals List</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Projector size={18} />
              <span>{portals?.length || 0} Portal(s)</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portals && portals.length > 0 ? (
                portals.map((portal) => (
                  <tr key={portal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {portal.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Projector size={16} className="text-blue-600" />
                        <div className="text-sm font-medium text-gray-900">
                          {portal.code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {portal.created_at
                          ? new Date(portal.created_at).toLocaleDateString()
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {portal.updated_at
                          ? new Date(portal.updated_at).toLocaleDateString()
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(portal.id)}
                          disabled={deletePortal.isPending}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Projector size={48} className="text-gray-400" />
                      <p>
                        No portals found. Create your first portal to get
                        started.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
