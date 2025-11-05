import KPI from '@/components/analytics/KPI';
import LineChart from '@/components/analytics/LineChart';
import BarChart from '@/components/analytics/BarChart';

export default function Dashboard() {
  const kpi = [
    { label: 'Total Employees', value: '1,248', subtitle: '+4.2% MoM' },
    { label: 'Active Sessions', value: 86, subtitle: '+12 today' },
    { label: 'Errors Today', value: 3, subtitle: '-1 vs yesterday' },
  ];

  const lineData = [18, 22, 35, 40, 38, 44, 52, 61, 58, 70, 68, 73];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const barData = [12, 35, 28, 44, 51, 39, 62];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {kpi.map((x) => (
          <KPI
            key={x.label}
            label={x.label}
            value={x.value}
            subtitle={x.subtitle}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LineChart
          title="Monthly Registrations"
          points={lineData}
          labels={months}
        />
        <BarChart title="Sessions by Day" values={barData} labels={days} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>User Bibek Thapa updated his profile</li>
            <li>New user Sita Sharma registered</li>
            <li>Ramesh KC requested a password reset</li>
            <li>Admin Dipesh Gurung exported the monthly report</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3">Top Employees</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Name</th>
                <th className="py-2">Department</th>
                <th className="py-2">Sessions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t">
                <td className="py-2">Bibek Thapa</td>
                <td className="py-2">Operations</td>
                <td className="py-2">42</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Sita Sharma</td>
                <td className="py-2">Finance</td>
                <td className="py-2">37</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Ramesh KC</td>
                <td className="py-2">Field Operations</td>
                <td className="py-2">31</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Anita Lama</td>
                <td className="py-2">Human Resources</td>
                <td className="py-2">28</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Dipesh Gurung</td>
                <td className="py-2">Information Technology</td>
                <td className="py-2">25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
