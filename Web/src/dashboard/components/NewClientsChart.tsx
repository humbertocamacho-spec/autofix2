import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [
  { month: "Jan", clients: 10 },
  { month: "Feb", clients: 40 },
  { month: "Mar", clients: 25 },
  { month: "Apr", clients: 60 },
  { month: "May", clients: 50 },
  { month: "Jun", clients: 75 }
];

export default function NewClientsChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="clients"
            stroke="#2953E8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
