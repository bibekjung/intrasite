import { UserCircle } from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <UserCircle className="text-blue-600" size={40} />
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">This is your profile page.</p>
      </div>
    </div>
  );
}
