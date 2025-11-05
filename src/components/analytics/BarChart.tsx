type BarChartProps = {
  title: string;
  values: number[]; // 0..100
  labels?: string[];
};

export default function BarChart({ title, values, labels }: BarChartProps) {
  const width = 600;
  const height = 220;
  const padding = 36;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const barGap = 10;
  const barW = (innerW - barGap * (values.length - 1)) / values.length;

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
        {values.map((v, i) => {
          const h = (v / 100) * innerH;
          const x = padding + i * (barW + barGap);
          const y = padding + innerH - h;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={h}
              fill="#10b981"
              rx={4}
            />
          );
        })}
        {labels && labels.length === values.length
          ? labels.map((t, i) => {
              const x = padding + i * (barW + barGap) + barW / 2;
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
