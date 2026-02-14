import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../ui/Card";
import Button from "../ui/Button";



export default function ComparisonView({ currentData, currentConfig, onSaveBaseline, baselineData }) {
    const currentTotals = currentData;

    const getPolicyName = (p) => {
        if (!p) return "Custom";
        if (p === "first_touch") return "First Touch";
        if (p === "interleaved") return "Interleaved";
        return "Random";
    };

    return (
        <Card title="Scenario Comparison" className="h-full flex flex-col">
            <div className="flex-1 space-y-6">
                {baselineData ? (
                    <div className="space-y-4">
                        {/* Header Context */}
                        <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-white/5">
                            <div>
                                <div className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Baseline</div>
                                <div className="text-xs font-mono text-scholar-300">
                                    {getPolicyName(baselineData.config?.policy)} ({baselineData.config?.nodes}N)
                                </div>
                            </div>
                            <div className="text-slate-600 font-serif italic text-xs">vs</div>
                            <div className="text-right">
                                <div className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Current</div>
                                <div className="text-xs font-mono text-cyan-300">
                                    {getPolicyName(currentConfig?.policy)} ({currentConfig?.nodes}N)
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <StatDiff
                                label="Local Access"
                                current={currentTotals?.local || 0}
                                baseline={baselineData.local}
                                max={Math.max(currentTotals?.local || 0, baselineData.local)}
                            />
                            <StatDiff
                                label="Remote Access"
                                current={currentTotals?.remote || 0}
                                baseline={baselineData.remote}
                                inverse
                                max={Math.max(currentTotals?.remote || 0, baselineData.remote)}
                            />
                            <StatDiff
                                label="Total Latency"
                                current={currentTotals?.time || 0}
                                baseline={baselineData.time}
                                inverse
                                max={Math.max(currentTotals?.time || 0, baselineData.time)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center px-6 gap-3 opacity-60">
                        <div className="p-3 bg-slate-800 rounded-full">
                            <TrendingUp className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-400 text-sm font-serif">
                            Capture a baseline to compare performance metrics across different configurations.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <Button
                    variant={baselineData ? "outline" : "primary"}
                    onClick={() => onSaveBaseline(currentTotals, currentConfig)}
                    disabled={!currentTotals}
                    className="w-full text-xs h-9 uppercase tracking-wider"
                >
                    {baselineData ? "Update Baseline" : "Capture Baseline Snapshot"}
                </Button>
            </div>
        </Card>
    );
}

function StatDiff({ label, current, baseline, inverse = false, max }) {
    const diff = current - baseline;
    const pct = baseline ? (diff / baseline) * 100 : 0;

    // Determine color state
    // For normal metrics (Local): Positive diff is Good (Green)
    // For inverse metrics (Latency/Remote): Negative diff is Good (Green)
    let isGood = inverse ? diff <= 0 : diff >= 0;
    if (Math.abs(diff) < 1) isGood = null; // Neutral if effectively equal

    const colorClass = isGood === true ? "text-emerald-400" : isGood === false ? "text-rose-400" : "text-slate-400";
    const barColor = isGood === true ? "bg-emerald-500" : isGood === false ? "bg-rose-500" : "bg-slate-500";

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-end text-xs">
                <span className="text-slate-400 font-medium">{label}</span>
                <div className={`font-mono font-bold flex items-center gap-1 ${colorClass}`}>
                    {diff > 0 ? "+" : ""}{diff === 0 ? "-" : pct.toFixed(1) + "%"}
                    {isGood === true ? <TrendingUp className="w-3 h-3" /> : isGood === false ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex relative">
                {/* Baseline Marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
                    style={{ left: `${(baseline / max) * 100}%` }}
                />

                {/* Current Value Bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(current / max) * 100}%` }}
                    className={`h-full ${barColor} opacity-80`}
                />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>{baseline.toLocaleString()} (Base)</span>
                <span>{current.toLocaleString()} (Curr)</span>
            </div>
        </div>
    );
}
