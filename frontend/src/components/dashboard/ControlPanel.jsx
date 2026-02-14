import Card from "../ui/Card";
import Button from "../ui/Button";
import Tooltip from "../ui/Tooltip";
import { Sliders, Play, RotateCw } from "lucide-react";

export default function ControlPanel({
    config,
    setConfig,
    onRun,
    loading,
    live,
    setLive,
    compareMode,
    setCompareMode
}) {

    const handleChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Card title="Simulation Configuration" className="h-full" delay={1}>
            <div className="space-y-6">

                {/* Nodes Slider */}
                <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                    <label className="text-sm font-serif text-slate-400 pb-1">NUMA Nodes</label>
                    <span className="text-cyan-400 font-mono text-lg font-bold">{config.nodes}</span>
                    <div className="col-span-2 relative h-6 flex items-center">
                        <div className="absolute inset-x-0 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500/30" style={{ width: `${(config.nodes / 8) * 100}%` }} />
                        </div>
                        <input
                            type="range" min="1" max="8" step="1"
                            value={config.nodes}
                            onChange={(e) => handleChange("nodes", Number(e.target.value))}
                            className="relative w-full z-10 opacity-0 cursor-pointer h-full"
                        />
                        <div
                            className="absolute h-4 w-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none transition-all duration-75"
                            style={{ left: `calc(${((config.nodes - 1) / 7) * 100}% - 8px)` }}
                        />
                    </div>
                </div>

                {/* Threads Slider */}
                <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                    <label className="text-sm font-serif text-slate-400 pb-1">Threads</label>
                    <span className="text-cyan-400 font-mono text-lg font-bold">{config.threads}</span>
                    <div className="col-span-2 relative h-6 flex items-center">
                        <div className="absolute inset-x-0 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500/30" style={{ width: `${(config.threads / 16) * 100}%` }} />
                        </div>
                        <input
                            type="range" min="1" max="16" step="1"
                            value={config.threads}
                            onChange={(e) => handleChange("threads", Number(e.target.value))}
                            className="relative w-full z-10 opacity-0 cursor-pointer h-full"
                        />
                        <div
                            className="absolute h-4 w-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none transition-all duration-75"
                            style={{ left: `calc(${((config.threads - 1) / 15) * 100}% - 8px)` }}
                        />
                    </div>
                </div>

                {/* Blocks Slider */}
                <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                    <label className="text-sm font-serif text-slate-400 pb-1">Memory Blocks</label>
                    <span className="text-cyan-400 font-mono text-lg font-bold">{config.blocks}</span>
                    <div className="col-span-2 relative h-6 flex items-center">
                        <div className="absolute inset-x-0 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500/30" style={{ width: `${(config.blocks / 256) * 100}%` }} />
                        </div>
                        <input
                            type="range" min="10" max="256" step="10"
                            value={config.blocks}
                            onChange={(e) => handleChange("blocks", Number(e.target.value))}
                            className="relative w-full z-10 opacity-0 cursor-pointer h-full"
                        />
                        <div
                            className="absolute h-4 w-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none transition-all duration-75"
                            style={{ left: `calc(${((config.blocks - 10) / 246) * 100}% - 8px)` }}
                        />
                    </div>
                </div>

                {/* Policy Slector */}
                <div className="space-y-2">
                    <label className="text-sm font-serif text-slate-400 block">Allocation Policy</label>
                    <select
                        value={config.policy}
                        onChange={(e) => handleChange("policy", e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-slate-200 font-mono text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 outline-none backdrop-blur transition-all"
                    >
                        <option value="random">Random Distribution</option>
                        <option value="first_touch">First Touch</option>
                        <option value="interleaved">Interleaved</option>
                    </select>
                    <div className="mt-2 p-2 rounded bg-white/5 border border-white/5">
                        {config.policy === "first_touch" &&
                            <span className="text-xs text-green-400 flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Optimizes for locality.</span>}
                        {config.policy === "random" &&
                            <span className="text-xs text-amber-400 flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> High latency variance.</span>}
                        {config.policy === "interleaved" &&
                            <span className="text-xs text-blue-400 flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Maximizes bandwidth.</span>}
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3 py-2">
                    <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white/5 rounded transition-colors">
                        <input
                            type="checkbox"
                            checked={config.pinning}
                            onChange={(e) => handleChange("pinning", e.target.checked)}
                            className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500/50 bg-slate-800 border-gray-600"
                        />
                        <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Thread Pinning (Affinity)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white/5 rounded transition-colors">
                        <input
                            type="checkbox"
                            checked={live}
                            onChange={(e) => setLive(e.target.checked)}
                            className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500/50 bg-slate-800 border-gray-600"
                        />
                        <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Live Simulation Stream</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/5 flex gap-3">
                    <Button
                        onClick={onRun}
                        loading={loading}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold tracking-wider py-4 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none clip-path-slant"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Play className={`w-4 h-4 ${loading ? 'hidden' : 'fill-white'}`} />
                            {loading ? "INITIALIZING..." : "INITIATE SIMULATION"}
                        </div>
                    </Button>
                </div>

            </div>
        </Card>
    );
}
