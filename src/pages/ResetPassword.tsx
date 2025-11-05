import { KeyRound, Lock } from 'lucide-react';

export default function ResetPassword() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <KeyRound className="text-blue-600" size={36} />
        <h2 className="text-2xl font-bold">Reset Password</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-5">
        <div>
          <label
            htmlFor="current"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Current Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              id="current"
              type="password"
              className="w-full py-2 outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="new"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              id="new"
              type="password"
              className="w-full py-2 outline-none"
              placeholder="At least 8 characters"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="confirm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm New Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              id="confirm"
              type="password"
              className="w-full py-2 outline-none"
              placeholder="Repeat new password"
            />
          </div>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
          Update Password
        </button>
      </div>
    </div>
  );
}
