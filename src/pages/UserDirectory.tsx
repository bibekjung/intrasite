import { useMemo, useState } from 'react';

type DirectoryUser = {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
};

const STATIC_USERS: DirectoryUser[] = [
  {
    id: 'U001',
    name: 'John Doe',
    department: 'Operations',
    position: 'Manager',
    phone: '+977-9800000001',
    email: 'john@company.com',
  },
  {
    id: 'U002',
    name: 'Jane Smith',
    department: 'Finance',
    position: 'Analyst',
    phone: '+977-9800000002',
    email: 'jane@company.com',
  },
  {
    id: 'U003',
    name: 'Alex Lee',
    department: 'Operations',
    position: 'Operator',
    phone: '+977-9800000003',
    email: 'alex@company.com',
  },
  {
    id: 'U004',
    name: 'Priya Karki',
    department: 'HR',
    position: 'Senior Officer',
    phone: '+977-9800000004',
    email: 'priya@company.com',
  },
  {
    id: 'U005',
    name: 'Ravi Shrestha',
    department: 'IT',
    position: 'Engineer',
    phone: '+977-9800000005',
    email: 'ravi@company.com',
  },
];

export default function UserDirectory() {
  const [department, setDepartment] = useState<string>('All');
  const [position, setPosition] = useState<string>('All');
  const departments = useMemo(
    () => [
      'All',
      ...Array.from(new Set(STATIC_USERS.map((u) => u.department))),
    ],
    [],
  );
  const positions = useMemo(
    () => ['All', ...Array.from(new Set(STATIC_USERS.map((u) => u.position)))],
    [],
  );

  const filtered = STATIC_USERS.filter(
    (u) =>
      (department === 'All' || u.department === department) &&
      (position === 'All' || u.position === position),
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Directory</h2>
      <div className="bg-white rounded-lg shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Department</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Position</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {positions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Email</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filtered.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 px-4">{u.id}</td>
                <td className="py-2 px-4">{u.name}</td>
                <td className="py-2 px-4">{u.department}</td>
                <td className="py-2 px-4">{u.position}</td>
                <td className="py-2 px-4">{u.phone}</td>
                <td className="py-2 px-4">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
