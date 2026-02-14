import { useEffect, useMemo, useRef, useState } from "react";
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
  CartesianGrid,
  Legend,
} from "recharts";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState(4);
  const [threads, setThreads] = useState(4);
  const [blocks, setBlocks] = useState(20);
  const [policy, setPolicy] = useState("random");
  const [pinning, setPinning] = useState(true);
  const [live, setLive] = useState(false);

  const [nodesB, setNodesB] = useState(4);
  const [threadsB, setThreadsB] = useState(4);
  const [blocksB, setBlocksB] = useState(20);
  const [policyB, setPolicyB] = useState("first_touch");
  const [pinningB, setPinningB] = useState(true);
  const [compare, setCompare] = useState(null);

  const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || (window && window.API_BASE) || "http://localhost:5000";
  const esRef = useRef(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  /* ---------------- RUN SIMULATION ---------------- */
  const runSimulation = async () => {
    try {
      setLoading(true);

      setError("");
      if (live) {
        runSimulationStream();
        return;
      }

      const res = await axios.post(`${API_BASE}/simulate`, {
        nodes,
        threads,
        blocks,
        policy,
        pinning,
      });

      setData(res.data);
      const sum = (arr, k) => arr.reduce((s, d) => s + Number(d[k]), 0);
      const summary = { ts: Date.now(), cfg: { nodes, threads, blocks, policy, pinning }, totals: { local: sum(res.data, "local"), remote: sum(res.data, "remote"), time: sum(res.data, "time") } };
      setHistory((h) => [summary, ...h].slice(0, 5));
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const runSimulationStream = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setData([]);
    const url = new URL(`${API_BASE}/simulate/stream`);
    url.searchParams.set("nodes", String(nodes));
    url.searchParams.set("threads", String(threads));
    url.searchParams.set("blocks", String(blocks));
    url.searchParams.set("policy", policy);
    url.searchParams.set("pinning", String(pinning));

    const es = new EventSource(url.toString());
    esRef.current = es;
    setLoading(true);

    es.addEventListener("result", (e) => {
      try {
        const row = JSON.parse(e.data);
        setData((prev) => [...prev, row]);
      } catch (e) { void e; }
    });
    es.addEventListener("end", () => {
      setLoading(false);
      es.close();
      esRef.current = null;
      const sum = (arr, k) => arr.reduce((s, d) => s + Number(d[k]), 0);
      setHistory((h) => [{ ts: Date.now(), cfg: { nodes, threads, blocks, policy, pinning }, totals: { local: sum(data, "local"), remote: sum(data, "remote"), time: sum(data, "time") } }, ...h].slice(0, 5));
    });
    es.addEventListener("error", () => {
      setLoading(false);
      setError("Stream connection error");
    });
  };

  useEffect(() => () => {
    if (esRef.current) esRef.current.close();
  }, []);

  const compareScenarios = async () => {
    try {
      setLoading(true);
      const [a, b] = await Promise.all([
        axios.post(`${API_BASE}/simulate`, { nodes, threads, blocks, policy, pinning }),
        axios.post(`${API_BASE}/simulate`, { nodes: nodesB, threads: threadsB, blocks: blocksB, policy: policyB, pinning: pinningB }),
      ]);

      const sum = (arr, key) => arr.reduce((s, d) => s + Number(d[key]), 0);
      const A = { local: sum(a.data, "local"), remote: sum(a.data, "remote"), time: sum(a.data, "time") };
      const B = { local: sum(b.data, "local"), remote: sum(b.data, "remote"), time: sum(b.data, "time") };
      const pct = (x, y) => (x === 0 ? 0 : ((y - x) / x) * 100);
      setCompare({ A, B, diff: { local: pct(A.local, B.local), remote: pct(A.remote, B.remote), time: pct(A.time, B.time) } });
      setData(a.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EXPORT JSON ---------------- */
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "results.json";
    a.click();
  };

  /* ---------------- EXPORT CSV ---------------- */
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

  /* ---------------- STATS ---------------- */

  const latencyMatrix = [
    [10, 45, 60, 75],
    [45, 10, 45, 60],
    [60, 45, 10, 45],
    [75, 60, 45, 10],
  ];

  const max = Math.max(...latencyMatrix.flat());

  /* ===================================================== */
  const cumulative = useMemo(() => data.map((d, i) => ({ idx: i, time: Number(d.time), ctime: data.slice(0, i + 1).reduce((s, x) => s + Number(x.time), 0) })), [data]);
  const totals = useMemo(() => ({ local: data.reduce((s, d) => s + Number(d.local), 0), remote: data.reduce((s, d) => s + Number(d.remote), 0), time: data.reduce((s, d) => s + Number(d.time), 0) }), [data]);
  const totalLocal = totals.local;
  const totalRemote = totals.remote;

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-10">
      <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">NUMA Performance Analyzer</h1>
          <p className="text-gray-300 mt-2">Explore NUMA locality effects using configurable scenarios, live results, and side-by-side comparisons.</p>
        </div>

        <div className="flex gap-3 items-center">
          <input
            type="number"
            min="1"
            value={nodes}
            onChange={(e) => setNodes(Number(e.target.value))}
            className="bg-slate-700 px-3 py-2 rounded w-20"
            aria-label="nodes"
          />
          <input
            type="number"
            min="1"
            value={threads}
            onChange={(e) => setThreads(Number(e.target.value))}
            className="bg-slate-700 px-3 py-2 rounded w-24"
            aria-label="threads"
          />
          <input
            type="number"
            min="1"
            value={blocks}
            onChange={(e) => setBlocks(Number(e.target.value))}
            className="bg-slate-700 px-3 py-2 rounded w-24"
            aria-label="blocks"
          />
          <select
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            className="bg-slate-700 px-3 py-2 rounded"
            aria-label="policy"
          >
            <option value="random">Random</option>
            <option value="first_touch">First Touch</option>
            <option value="interleaved">Interleaved</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pinning}
              onChange={(e) => setPinning(e.target.checked)}
            />
            Pin Threads
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={live}
              onChange={(e) => setLive(e.target.checked)}
            />
            Live Updates
          </label>
          <button
            onClick={runSimulation}
            disabled={loading}
            className={`px-6 py-3 rounded-lg ${loading?"bg-blue-800 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Running..." : "Run Simulation"}
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
      </header>

      <section className="bg-neutral-900/80 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-gray-300">This page models local and remote memory accesses across NUMA nodes. Use the controls to set the topology and allocation policy. Toggle pinning to simulate thread affinity. Run single scenarios or compare two configurations to quantify changes in locality and latency.</p>
      </section>

      {error && (
        <div className="bg-red-600/30 border border-red-600 text-red-200 px-4 py-3 rounded">{error}</div>
      )}

      {/* ---------------- STATS ---------------- */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900 p-6 rounded-xl">
          <div className="text-sm text-gray-400">Local Access</div>
          <div className="text-3xl font-bold text-green-400">{totals.local}</div>
        </div>
        <div className="bg-neutral-900 p-6 rounded-xl">
          <div className="text-sm text-gray-400">Remote Access</div>
          <div className="text-3xl font-bold text-rose-400">{totals.remote}</div>
        </div>
        <div className="bg-neutral-900 p-6 rounded-xl">
          <div className="text-sm text-gray-400">Total Time (ns)</div>
          <div className="text-3xl font-bold text-cyan-400">{totals.time}</div>
        </div>
      </section>

      {/* ---------------- CHARTS ---------------- */}
      {data.length > 0 && (
        <section className="grid grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="bg-neutral-900 p-6 rounded-xl">
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

          {/* Pie Chart */}
          <div className="bg-neutral-900 p-6 rounded-xl">
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

          {/* Line Chart */}
          <div className="bg-neutral-900 p-6 rounded-xl">
            <h2 className="mb-4 font-semibold">Cumulative Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulative}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="idx" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ctime" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="bg-neutral-900 p-6 rounded-xl">
        <h2 className="mb-4 font-semibold">Scenario Compare</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <input type="number" min="1" value={nodesB} onChange={(e)=>setNodesB(Number(e.target.value))} className="bg-slate-700 px-3 py-2 rounded w-20" aria-label="nodesB" />
          <input type="number" min="1" value={threadsB} onChange={(e)=>setThreadsB(Number(e.target.value))} className="bg-slate-700 px-3 py-2 rounded w-24" aria-label="threadsB" />
          <input type="number" min="1" value={blocksB} onChange={(e)=>setBlocksB(Number(e.target.value))} className="bg-slate-700 px-3 py-2 rounded w-24" aria-label="blocksB" />
          <select value={policyB} onChange={(e)=>setPolicyB(e.target.value)} className="bg-slate-700 px-3 py-2 rounded" aria-label="policyB">
            <option value="random">Random</option>
            <option value="first_touch">First Touch</option>
            <option value="interleaved">Interleaved</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pinningB} onChange={(e)=>setPinningB(e.target.checked)} />
            Pin Threads
          </label>
          <button onClick={compareScenarios} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg">{loading?"Comparing...":"Compare"}</button>
        </div>
        {compare && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-neutral-800 p-4 rounded">
              <div className="font-semibold mb-2">Remote Access</div>
              <div>A: {compare.A.remote}</div>
              <div>B: {compare.B.remote}</div>
              <div className={compare.diff.remote <= 0 ? "text-green-400" : "text-red-400"}>{compare.diff.remote.toFixed(1)}%</div>
            </div>
            <div className="bg-neutral-800 p-4 rounded">
              <div className="font-semibold mb-2">Local Access</div>
              <div>A: {compare.A.local}</div>
              <div>B: {compare.B.local}</div>
              <div>{compare.diff.local.toFixed(1)}%</div>
            </div>
            <div className="bg-neutral-800 p-4 rounded">
              <div className="font-semibold mb-2">Total Time (ns)</div>
              <div>A: {compare.A.time}</div>
              <div>B: {compare.B.time}</div>
              <div className={compare.diff.time <= 0 ? "text-green-400" : "text-red-400"}>{compare.diff.time.toFixed(1)}%</div>
            </div>
          </div>
        )}
        <p className="text-gray-400 mt-4">Negative percentage in Remote Access or Total Time indicates an improvement in locality and latency for the second scenario.</p>
      </section>

      {/* ---------------- HEATMAP ---------------- */}
      <section className="bg-neutral-900 p-6 rounded-xl">
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
        <p className="text-gray-400 mt-4">The heatmap illustrates static node-to-node latency used by the simulator. Diagonal cells represent local memory access (lowest latency).</p>
      </section>

      {/* ---------------- TABLE ---------------- */}
      {data.length > 0 && (
        <section className="bg-neutral-900 p-6 rounded-xl overflow-x-auto">
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
          <p className="text-gray-400 mt-4">Values are per-thread totals for the chosen number of blocks. Use the export buttons to download results for offline analysis.</p>
        </section>
      )}

      {history.length > 0 && (
        <section className="bg-neutral-900 p-6 rounded-xl">
          <h2 className="mb-4 font-semibold">Recent Runs</h2>
          <div className="space-y-3 text-sm">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-neutral-800 p-3 rounded">
                <div>
                  <div className="font-semibold">{new Date(h.ts).toLocaleTimeString()}</div>
                  <div className="text-gray-400">nodes {h.cfg.nodes}, threads {h.cfg.threads}, blocks {h.cfg.blocks}, {h.cfg.policy}, pin {String(h.cfg.pinning)}</div>
                </div>
                <div className="flex gap-4">
                  <span className="text-green-300">L {h.totals.local}</span>
                  <span className="text-rose-300">R {h.totals.remote}</span>
                  <span className="text-cyan-300">T {h.totals.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-neutral-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Interpretation Guide</h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Local access means the thread reads from its home node; keep this high.</li>
          <li>Remote access indicates cross-node traffic; reduce this to lower latency.</li>
          <li>Pin Threads emulates CPU affinity; with first-touch, it maximizes locality.</li>
          <li>Interleaved spreads blocks across nodes; latency reflects distribution.</li>
        </ul>
      </section>

      <footer className="text-gray-500 text-sm text-center py-8">NUMA Performance Analyzer • Dark theme • Times New Roman</footer>
      </div>
    </div>
  );
}
