import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

export default function RadialChart({ percentage }: { percentage: number }) {
  const data = [{ name: "Progress", value: percentage, fill: "#2953E8" }];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          barSize={18}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {percentage}%
      </div>
    </div>
  );
}
