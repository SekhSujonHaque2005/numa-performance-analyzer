import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function App() {
  const [data, setData] = useState([]);
  const [multiData, setMultiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/simulate");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const runMulti = async () => {
    const res = await axios.post("http://localhost:5000/simulate/multi");
    setMultiData(res.data);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "results.json";
    a.click();
  };

  const downloadCSV = () => {
    const csv =
      "thread,local,remote,time\n" +
      data
        .map((d) => `${d.thread},${d.local},${d.remote},${d.time}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "results.csv";
    a.click();
  };

  const totalLocal = data.reduce((s, d) => s + Number(d.local), 0);
  const totalRemote = data.reduce((s, d) => s + Number(d.remote), 0);

  const latencyMatrix = [
    [10, 45, 60, 75],
    [45, 10, 45, 60],
    [60, 45, 10, 45],
    [75, 60, 45, 10],
  ];

  const max = Math.max(...latencyMatrix.flat());

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">NUMA Performance Analyzer</h1>

        <div className="flex gap-3">
          <button
            onClick={runSimulation}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            {loading ? "Running..." : "Run Simulation"}
          </button>

          <button
            onClick={runMulti}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
          >
            Multi Run
          </button>

          <button
            onClick={downloadJSON}
            className="bg-green-600 px-4 py-2 rounded"
          >
            JSON
          </button>

          <button
            onClick={downloadCSV}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            CSV
          </button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="mb-4 font-semibold">Latency Per Thread</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="thread" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="time" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="mb-4 font-semibold">Access Distribution</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Local", value: totalLocal },
                    { name: "Remote", value: totalRemote },
                  ]}
                  dataKey="value"
                  outerRadius={100}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {multiData.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="mb-4 font-semibold">Multi-Run Average Latency</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={multiData}>
              <XAxis dataKey="run" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line type="monotone" dataKey="avg" stroke="#f97316" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-slate-800 p-6 rounded-xl">
        <h2 className="mb-4 font-semibold">NUMA Latency Heatmap</h2>

        <div className="grid grid-cols-4 gap-2">
          {latencyMatrix.flat().map((val, i) => {
            const intensity = val / max;

            return (
              <div
                key={i}
                className="p-4 text-center rounded font-bold"
                style={{
                  backgroundColor: `rgba(239,68,68,${intensity})`,
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>

      {data.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl overflow-x-auto">
          <h2 className="mb-4 font-semibold">Thread Table</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-slate-700">
                <th className="py-2">Thread</th>
                <th>Local</th>
                <th>Remote</th>
                <th>Time (ns)</th>
              </tr>
            </thead>

            <tbody>
              {data.map((t, i) => (
                <tr key={i} className="border-t border-slate-700">
                  <td className="py-2">{t.thread}</td>
                  <td>{t.local}</td>
                  <td>{t.remote}</td>
                  <td>{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
