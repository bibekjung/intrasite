export default function Settings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Organization Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="KARJA SUCHANA KENDRA"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Language
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>English</option>
                  <option>Nepali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Timezone
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>GMT+5:45</option>
                  <option>GMT+5:30</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input id="theme" type="checkbox" className="h-4 w-4" />
              <label htmlFor="theme" className="text-sm text-gray-700">
                Enable dark theme
              </label>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Notifications</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Email alerts</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS alerts</span>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <span>Push notifications</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-5 text-right">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Roles & Permissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 px-4">Permission</th>
                  <th className="py-2 px-4">Admin</th>
                  <th className="py-2 px-4">Manager</th>
                  <th className="py-2 px-4">Staff</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  { key: 'Dashboard', admin: true, manager: true, staff: true },
                  {
                    key: 'NID Search',
                    admin: true,
                    manager: true,
                    staff: false,
                  },
                  { key: 'Directory', admin: true, manager: true, staff: true },
                  {
                    key: 'Settings',
                    admin: true,
                    manager: false,
                    staff: false,
                  },
                ].map((row) => (
                  <tr key={row.key} className="border-b">
                    <td className="py-2 px-4">{row.key}</td>
                    <td className="py-2 px-4">
                      <input type="checkbox" checked={row.admin} readOnly />
                    </td>
                    <td className="py-2 px-4">
                      <input type="checkbox" checked={row.manager} readOnly />
                    </td>
                    <td className="py-2 px-4">
                      <input type="checkbox" checked={row.staff} readOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
