interface Props {
  number: string | number;
  label: string;
  iconPath: string;
  iconColor?: string;
}

export default function StatCard({ number, label, iconPath, iconColor = "#2953E8" }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold">{number}</h2>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>

      <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
        <path d={iconPath} fill={iconColor} />
      </svg>
    </div>
  );
}
