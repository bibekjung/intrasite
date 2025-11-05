type LineChartProps = {
  title: string;
  points: number[]; // 0..100
  labels?: string[];
};

export default function LineChart({ title, points, labels }: LineChartProps) {
  const width = 600;
  const height = 220;
  const padding = 36;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const stepX = innerW / Math.max(points.length - 1, 1);

  const path = points
    .map((p, i) => {
      const x = padding + i * stepX;
      const y = padding + innerH - (p / 100) * innerH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
        <rect
          x={padding}
          y={padding}
          width={innerW}
          height={innerH}
          fill="#f9fafb"
        />
        {/* grid */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = padding + innerH - (v / 100) * innerH;
          return (
            <line
              key={v}
              x1={padding}
              y1={y}
              x2={padding + innerW}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
          );
        })}
        <path d={path} fill="none" stroke="#2563eb" strokeWidth={2} />
        {/* area fill */}
        <path
          d={`${path} L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`}
          fill="#2563eb22"
        />
        {/* points */}
        {points.map((p, i) => {
          const x = padding + i * stepX;
          const y = padding + innerH - (p / 100) * innerH;
          return <circle key={i} cx={x} cy={y} r={3} fill="#2563eb" />;
        })}
        {/* x-labels */}
        {labels && labels.length === points.length
          ? labels.map((t, i) => {
              const x = padding + i * stepX;
              return (
                <text
                  key={i}
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {t}
                </text>
              );
            })
          : null}
      </svg>
    </div>
  );
}
