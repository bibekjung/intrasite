'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">User Directory</h2>

      {/* Filter Section */}
      <Card className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Position</Label>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="p-2">
        <Table>
          <TableCaption>
            {filtered.length
              ? 'List of employees filtered by selection.'
              : 'No users found for selected filters.'}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.department}</TableCell>
                <TableCell>{u.position}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>{u.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
