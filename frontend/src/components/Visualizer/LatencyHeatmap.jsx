import { motion } from "framer-motion";
import Card from "../ui/Card";

export default function LatencyHeatmap({ nodes }) {
    // Generate a mock latency matrix for demonstration
    // In a real app, this would come from the backend `numactl -H`
    const matrix = Array.from({ length: nodes }, (_, i) =>
        Array.from({ length: nodes }, (_, j) => {
            if (i === j) return 10; // Local access
            const dist = Math.abs(i - j);
            return 10 + (dist * 10) + (Math.random() * 5); // Simulated remote latency
        })
    );

    const maxLatency = Math.max(...matrix.flat());

    return (
        <Card title="Interconnect Latency Heatmap" className="h-full">
            <div
                className="grid gap-2 h-full w-full aspect-square p-2"
                style={{ gridTemplateColumns: `repeat(${nodes}, 1fr)` }}
            >
                {matrix.flat().map((latency, i) => {
                    const intensity = latency / maxLatency;
                    // Color interpolation: Green (low) -> Yellow -> Red (high)
                    // For Dark Mode: Cyan (low) -> Purple (mid) -> Red (high)
                    // Using inline styles for dynamic heatmap colors
                    const color = latency < 15 ? '#00f0ff' : latency < 30 ? '#bf00ff' : '#ff0055';
                    const opacity = 0.3 + (intensity * 0.7);

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className="rounded-md flex items-center justify-center text-xs font-mono text-white/90 relative group cursor-crosshair border border-white/5 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                            style={{ backgroundColor: color, opacity }}
                        >
                            <span className="relative z-10 drop-shadow-md">{Math.round(latency)}</span>
                            <div className="absolute inset-0 bg-transparent group-hover:border-2 border-white transition-all z-20" />
                        </motion.div>
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-neutral-500 font-mono mt-3">
                <span>Low Latency (Local)</span>
                <span>High Latency (Remote)</span>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-[#00f0ff] via-[#bf00ff] to-[#ff0055] rounded-full mt-1" />
        </Card>
    );
}
