type KPIProps = {
  label: string;
  value: string | number;
  subtitle?: string;
};

export default function KPI({ label, value, subtitle }: KPIProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      {subtitle ? (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      ) : null}
    </div>
  );
}
