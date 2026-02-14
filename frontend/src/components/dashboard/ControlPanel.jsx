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
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-serif text-slate-400">NUMA Nodes</label>
                        <span className="text-scholar-300 font-mono">{config.nodes}</span>
                    </div>
                    <input
                        type="range" min="1" max="8" step="1"
                        value={config.nodes}
                        onChange={(e) => handleChange("nodes", Number(e.target.value))}
                        className="w-full accent-scholar-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <Tooltip content="Number of physical memory nodes in the simulated system. Accessing memory across nodes incurs higher latency.">
                        <span className="text-xs text-slate-500">Architecture Definition</span>
                    </Tooltip>
                </div>

                {/* Threads Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-serif text-slate-400">Threads</label>
                        <span className="text-scholar-300 font-mono">{config.threads}</span>
                    </div>
                    <input
                        type="range" min="1" max="16" step="1"
                        value={config.threads}
                        onChange={(e) => handleChange("threads", Number(e.target.value))}
                        className="w-full accent-scholar-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Blocks Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-serif text-slate-400">Memory Blocks</label>
                        <span className="text-scholar-300 font-mono">{config.blocks}</span>
                    </div>
                    <input
                        type="range" min="10" max="256" step="10"
                        value={config.blocks}
                        onChange={(e) => handleChange("blocks", Number(e.target.value))}
                        className="w-full accent-scholar-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Policy Slector */}
                <div className="space-y-2">
                    <label className="text-sm font-serif text-slate-400 block">Allocation Policy</label>
                    <select
                        value={config.policy}
                        onChange={(e) => handleChange("policy", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-slate-200 font-mono text-sm focus:border-scholar-500 outline-none"
                    >
                        <option value="random">Random Distribution</option>
                        <option value="first_touch">First Touch</option>
                        <option value="interleaved">Interleaved</option>
                    </select>
                    <div className="mt-1">
                        {config.policy === "first_touch" &&
                            <span className="text-xs text-green-400">✅ Optimizes for locality by allocating memory on the accessing thread's node.</span>}
                        {config.policy === "random" &&
                            <span className="text-xs text-amber-400">⚠️ High variance in latency due to unpredictable placement.</span>}
                        {config.policy === "interleaved" &&
                            <span className="text-xs text-blue-400">ℹ️ Spreads memory evenly to maximize bandwidth utilization.</span>}
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3 py-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={config.pinning}
                            onChange={(e) => handleChange("pinning", e.target.checked)}
                            className="w-4 h-4 rounded text-scholar-500 focus:ring-scholar-600 bg-slate-800 border-gray-600"
                        />
                        <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Thread Pinning (Affinity)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={live}
                            onChange={(e) => setLive(e.target.checked)}
                            className="w-4 h-4 rounded text-scholar-500 focus:ring-scholar-600 bg-slate-800 border-gray-600"
                        />
                        <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Live Simulation Stream</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-700/50 flex gap-3">
                    <Button onClick={onRun} loading={loading} className="flex-1">
                        <Play className="w-4 h-4" /> Run Experiment
                    </Button>
                </div>

            </div>
        </Card>
    );
}
