import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";
import Card from "../ui/Card";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 border border-scholar-500/30 p-3 rounded shadow-xl backdrop-blur-sm">
                <p className="text-scholar-200 font-serif mb-2 border-b border-slate-700 pb-1">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="text-xs font-mono" style={{ color: p.color }}>
                        {p.name}: {Number(p.value).toLocaleString()}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function Charts({ data, cumulative }) {
    const totals = data.reduce(
        (acc, curr) => ({
            local: acc.local + Number(curr.local),
            remote: acc.remote + Number(curr.remote)
        }),
        { local: 0, remote: 0 }
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* Latency Distribution */}
            <Card title="Thread Latency Distribution" delay={2} className="min-h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="thread" stroke="#94a3b8" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Bar dataKey="time" name="Latency (ns)" fill="#38bdf8" radius={[4, 4, 0, 0]} animationDuration={1500} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Access Ratio */}
            <Card title="Local vs Remote Ratio" delay={3} className="min-h-[350px]">
                <div className="flex items-center justify-center h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: "Local", value: totals.local },
                                    { name: "Remote", value: totals.remote },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                <Cell fill="#34d399" stroke="rgba(0,0,0,0)" />
                                <Cell fill="#f43f5e" stroke="rgba(0,0,0,0)" />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Cumulative Trend */}
            <Card title="Cumulative Latency Trend" delay={4} className="col-span-1 lg:col-span-2 min-h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cumulative}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="idx" stroke="#94a3b8" tick={{ fontSize: 12, fontFamily: 'monospace' }} label={{ value: 'Sample Index', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="ctime"
                            name="Cumulative Time"
                            stroke="#818cf8"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: "#fff" }}
                            animationDuration={2000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

        </div>
    );
}
