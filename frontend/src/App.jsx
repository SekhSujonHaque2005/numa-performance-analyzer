import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Download, Activity, FlaskConical, Github, BookOpen } from "lucide-react";

import ControlPanel from "./components/dashboard/ControlPanel";
import Metrics from "./components/dashboard/Metrics";
import Charts from "./components/dashboard/Charts";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import Tooltip from "./components/ui/Tooltip";
import NodeTopology3D from "./components/Visualizer/NodeTopology3D";
import ParticleBackground from "./components/ui/ParticleBackground";
import ReportGenerator from "./components/Reporting/ReportGenerator";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    nodes: 4,
    threads: 4,
    blocks: 20,
    policy: "random",
    pinning: true
  });
  const [live, setLive] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || (window && window.API_BASE) || "http://localhost:5000";
  const esRef = useRef(null);

  /* ---------------- RUN SIMULATION ---------------- */
  const runSimulation = async () => {
    try {
      setLoading(true);
      setError("");
      setData([]);

      if (live) {
        runSimulationStream();
        return;
      }

      const res = await axios.post(`${API_BASE}/simulate`, config);
      setData(res.data);
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      if (!live) setLoading(false);
    }
  };

  const runSimulationStream = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    const url = new URL(`${API_BASE}/simulate/stream`);
    Object.keys(config).forEach(key => url.searchParams.set(key, String(config[key])));

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
    });
    es.addEventListener("error", () => {
      setLoading(false);
      setError("Stream connection error");
    });
  };

  useEffect(() => () => {
    if (esRef.current) esRef.current.close();
  }, []);

  /* ---------------- CALCULATIONS ---------------- */
  const cumulative = useMemo(() =>
    data.map((d, i) => ({
      idx: i,
      time: Number(d.time),
      ctime: data.slice(0, i + 1).reduce((s, x) => s + Number(x.time), 0)
    })),
    [data]
  );

  const totals = useMemo(() => ({
    local: data.reduce((s, d) => s + Number(d.local), 0),
    remote: data.reduce((s, d) => s + Number(d.remote), 0),
    time: data.reduce((s, d) => s + Number(d.time), 0)
  }), [data]);

  /* ---------------- EXPORTS ---------------- */
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "results.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-scholar-500/30 overflow-x-hidden">

      <ParticleBackground />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-scholar-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8 relative z-10 space-y-6">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6 backdrop-blur-sm bg-slate-900/30 p-6 rounded-2xl border border-white/10 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-scholar-500/10 rounded-xl border border-scholar-500/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <FlaskConical className="w-8 h-8 text-scholar-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white drop-shadow-md">
                  NUMA <span className="text-scholar-400">Analyzer</span>
                </h1>
                <p className="text-scholar-400 font-serif italic text-lg opacity-80">
                  Extreme Performance Research Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.open('https://github.com', '_blank')}>
              <Github className="w-4 h-4" /> Repo
            </Button>
            <Button variant="outline" onClick={() => window.open('https://en.wikipedia.org/wiki/Non-uniform_memory_access', '_blank')}>
              <BookOpen className="w-4 h-4" /> Docs
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 rounded-lg border border-scholar-500/30 shadow-inner">
              <Activity className={`w-4 h-4 ${live || loading ? "text-green-400 animate-pulse" : "text-slate-500"}`} />
              <span className="text-sm font-mono text-slate-300">
                {loading ? "PROCESSING..." : "SYSTEM READY"}
              </span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* Left Column: Controls & 3D Visualization */}
          <div className="xl:col-span-3 space-y-6 flex flex-col">
            <ControlPanel
              config={config}
              setConfig={setConfig}
              onRun={runSimulation}
              loading={loading}
              live={live}
              setLive={setLive}
            />

            <Card title="Topology Visualizer" className="flex-1 min-h-[300px] p-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 pointer-events-none z-10" />
              <NodeTopology3D nodes={config.nodes} activeNode={loading ? Math.floor(Math.random() * config.nodes) : -1} />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="flex items-center gap-2 text-xs text-scholar-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-scholar-500 animate-pulse" />
                  Active Node
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <ReportGenerator data={data} config={config} />
              <Button variant="outline" onClick={downloadJSON} disabled={data.length === 0} className="w-full">
                <Download className="w-4 h-4" /> JSON
              </Button>
            </div>
          </div>

          {/* Right Column: Results & Analytics */}
          <div className="xl:col-span-9 space-y-6" id="dashboard-content">

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-center gap-3 backdrop-blur-md"
              >
                <Info className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {data.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <Metrics
                    locals={totals.local}
                    remotes={totals.remote}
                    time={totals.time}
                  />

                  <Charts data={data} cumulative={cumulative} />

                  {/* Detailed Data Table */}
                  <Card title="Thread-Level Analysis" delay={5} className="overflow-hidden">
                    <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-scholar-700 scrollbar-track-slate-900">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                          <tr className="border-b border-scholar-500/30 text-scholar-300 font-serif text-sm uppercase tracking-wider">
                            <th className="py-4 pl-4">Thread ID</th>
                            <th className="py-4">Local Access</th>
                            <th className="py-4">Remote Access</th>
                            <th className="py-4">Latency (ns)</th>
                            <th className="py-4 pr-4">Locality Score</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-sm text-slate-300">
                          {data.map((row, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="border-b border-slate-800/50 hover:bg-scholar-900/20 transition-colors group"
                            >
                              <td className="py-3 pl-4 text-scholar-400 group-hover:text-white transition-colors">#{row.thread}</td>
                              <td className="py-3">{row.local.toLocaleString()}</td>
                              <td className="py-3">{row.remote.toLocaleString()}</td>
                              <td className="py-3 text-cyan-300">{row.time.toLocaleString()}</td>
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                                    <div
                                      className={`h-full transition-all duration-1000 ${row.local > row.remote ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"}`}
                                      style={{ width: `${(row.local / (row.local + row.remote)) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs w-8 text-right">
                                    {((row.local / (row.local + row.remote)) * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[600px] flex flex-col items-center justify-center text-slate-500 space-y-6 border border-slate-800/50 bg-slate-900/20 rounded-xl backdrop-blur-sm"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-scholar-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="p-6 bg-slate-900 rounded-full border border-scholar-500/30 relative z-10 shadow-2xl">
                      <Activity className="w-12 h-12 text-scholar-400" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-serif text-2xl text-slate-200">System Standby</h3>
                    <p className="font-mono text-sm text-slate-400 max-w-md">
                      Configure parameters in the Control Panel and initialize the simulation engine to visualize thread locality data.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        <footer className="border-t border-white/5 pt-8 text-center md:flex justify-between items-center text-slate-500 text-sm pb-4">
          <p className="font-serif">© 2026 NUMA Research Group. Advanced Systems Laboratory.</p>
          <p className="font-mono text-xs opacity-50 hover:opacity-100 transition-opacity cursor-default">
            v3.0.0-EXTREME • Three.js • React • C Engine
          </p>
        </footer>

      </div>
    </div>
  );
}
