import Button from "../ui/Button";
import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Presets({ onApply }) {
    const presets = [
        {
            id: "ideal",
            name: "Ideal Local",
            icon: CheckCircle2,
            color: "text-emerald-500",
            desc: "Max locality. Best performance.",
            config: { nodes: 4, threads: 4, blocks: 20, policy: "first_touch", pinning: true }
        },
        {
            id: "stress",
            name: "Interleaved Stress",
            icon: Zap,
            color: "text-yellow-500",
            desc: "Distributed memory. High traffic.",
            config: { nodes: 8, threads: 16, blocks: 100, policy: "interleaved", pinning: false }
        },
        {
            id: "worst",
            name: "Worst Case",
            icon: AlertTriangle,
            color: "text-rose-500",
            desc: "Random access. High latency.",
            config: { nodes: 4, threads: 8, blocks: 50, policy: "random", pinning: false }
        }
    ];

    return (
        <div className="grid grid-cols-3 gap-3 mb-6">
            {presets.map((p) => (
                <button
                    key={p.id}
                    onClick={() => onApply(p.config)}
                    className="relative group flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 overflow-hidden"
                >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none`} />

                    <div className={`p-2.5 rounded-full bg-slate-950/50 border border-white/10 ${p.color} bg-opacity-20 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                        <p.icon className="w-5 h-5" />
                    </div>

                    <span className="text-slate-200 font-serif font-bold tracking-wide text-sm text-center mb-1 group-hover:text-white transition-colors">
                        {p.name}
                    </span>

                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-mono text-center opacity-80 group-hover:opacity-100 transition-opacity">
                        {p.id === 'ideal' ? 'Best Perf' : p.id === 'stress' ? 'High Load' : 'High Latency'}
                    </p>
                </button>
            ))}
        </div>
    );
}
