import { motion } from "framer-motion";
import Card from "../ui/Card";
import Tooltip from "../ui/Tooltip";
import { ArrowUpRight, ArrowDownRight, Clock, Network, Cpu } from "lucide-react";

const MetricItem = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: delay * 0.1 }}
        className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex items-center justify-between"
    >
        <div>
            <p className="text-slate-400 text-xs font-serif uppercase tracking-wider mb-1">{label}</p>
            <div className={`text-2xl font-bold font-mono ${color}`}>{value.toLocaleString()}</div>
        </div>
        <div className={`p-3 rounded-full bg-slate-800 border border-slate-700 ${color.replace("text-", "text-opacity-80 ")}`}>
            <Icon className="w-5 h-5" />
        </div>
    </motion.div>
);

export default function Metrics({ locals, remotes, time }) {
    const total = locals + remotes;
    const localPct = total > 0 ? ((locals / total) * 100).toFixed(1) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricItem
                label="Local Access"
                value={locals}
                icon={Cpu}
                color="text-emerald-400"
                delay={1}
            />
            <MetricItem
                label="Remote Access"
                value={remotes}
                icon={Network}
                color="text-rose-400"
                delay={2}
            />
            <MetricItem
                label="Total Latency (ns)"
                value={time}
                icon={Clock}
                color="text-cyan-400"
                delay={3}
            />
        </div>
    );
}
