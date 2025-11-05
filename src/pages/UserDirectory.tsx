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
    id: 'KSKL01',
    name: 'Bibek Thapa',
    department: 'Operations',
    position: 'Manager',
    phone: '+977-9801000001',
    email: 'bibek.thapa@company.com',
  },
  {
    id: 'KSKL02',
    name: 'Sita Sharma',
    department: 'Finance',
    position: 'Account Officer',
    phone: '+977-9801000002',
    email: 'sita.sharma@company.com',
  },
  {
    id: 'KSKL03',
    name: 'Ramesh KC',
    department: 'Operations',
    position: 'Field Supervisor',
    phone: '+977-9801000003',
    email: 'ramesh.kc@company.com',
  },
  {
    id: 'KSKL04',
    name: 'Anita Lama',
    department: 'Human Resources',
    position: 'HR Officer',
    phone: '+977-9801000004',
    email: 'anita.lama@company.com',
  },
  {
    id: 'KSKL05',
    name: 'Dipesh Gurung',
    department: 'Information Technology',
    position: 'Software Engineer',
    phone: '+977-9801000005',
    email: 'dipesh.gurung@company.com',
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
