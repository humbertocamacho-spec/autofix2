import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const dataDaily = [
  { day: "01", value: 40 },
  { day: "02", value: 20 },
  { day: "03", value: 60 },
  { day: "04", value: 35 },
  { day: "05", value: 80 },
  { day: "06", value: 30 }
];

const dataWeekly = [
  { day: "W1", value: 20 },
  { day: "W2", value: 50 },
  { day: "W3", value: 30 },
  { day: "W4", value: 80 }
];

const dataMonthly = [
  { day: "Jan", value: 50 },
  { day: "Feb", value: 30 },
  { day: "Mar", value: 90 },
  { day: "Apr", value: 40 },
  { day: "May", value: 70 }
];

export default function TimelineChart({ tab }: { tab: string }) {
  let data = dataDaily;

  if (tab === "Weekly") data = dataWeekly;
  if (tab === "Monthly") data = dataMonthly;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2953E8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
