import { motion } from "framer-motion";
import { Activity, Cpu, Network, Zap, ChevronRight, Github, FlaskConical, BarChart3, Layers } from "lucide-react";
import Button from "./ui/Button";
import ParticleBackground from "./ui/ParticleBackground";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6 }}
        className="p-6 rounded-2xl bg-neutral-900/40 border border-white/5 backdrop-blur-sm group hover:bg-neutral-800/40 hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="bg-neutral-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-white/5 relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-xl font-serif text-neutral-200 mb-2 relative z-10">{title}</h3>
        <p className="text-neutral-500 text-sm leading-relaxed relative z-10 font-sans">{description}</p>
    </motion.div>
);

export default function LandingPage({ onStart }) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden relative flex flex-col">
            <ParticleBackground />

            {/* Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute top-[20%] left-[50%] translate-x-[-50%] w-[60%] h-[60%] bg-slate-900/30 blur-[100px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-serif font-bold text-lg tracking-tight text-neutral-200">NUMA <span className="text-cyan-400">Analyzer</span></span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => window.open('https://github.com', '_blank')} className="text-sm font-mono text-neutral-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                        <Github className="w-4 h-4" /> GitHub
                    </button>
                    <button onClick={() => window.open('https://www.kernel.org/doc/html/latest/admin-guide/mm/numa_memory_policy.html', '_blank')} className="text-sm font-mono text-neutral-500 hover:text-cyan-400 transition-colors">Documentation</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-40 max-w-5xl mx-auto px-6 text-center py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700/50 mb-8 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">v3.0 Extreme Edition Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Visualizing the Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 animate-gradient">Memory Dynamics</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Advanced NUMA performance analysis platform for high-performance computing research.
                        Visualize thread locality, latency topology, and memory bottlenecks in real-time.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStart}
                            className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all"
                        >
                            Initialize Platform <ChevronRight className="w-4 h-4" />
                        </motion.button>
                        <Button variant="outline" onClick={() => window.open('https://people.freebsd.org/~lstewart/articles/cpumemory.pdf', '_blank')} className="px-8 py-4 h-auto rounded-xl border-neutral-700 hover:bg-neutral-800 text-neutral-300">
                            Read the Paper
                        </Button>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left">
                    <FeatureCard
                        icon={Network}
                        title="Topology Visualization"
                        description="Interactive 3D rendering of node interconnects and latency paths. Understand physical layout at a glance."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Zap}
                        title="C-Engine Simulation"
                        description="High-fidelity backend engine simulating nanosecond-precision memory access patterns and thread contention."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={BarChart3}
                        title="Real-time Analytics"
                        description="Live streaming data coupled with batched updates for smooth 60ms visual feedback cycles."
                        delay={0.6}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 text-center relative z-40 bg-black/40 backdrop-blur-md">
                <p className="text-neutral-600 text-xs font-serif tracking-wider">
                    © 2026 ADVANCED SYSTEMS LABORATORY • NUMA RESEARCH GROUP
                </p>
            </footer>
        </div>
    );
}
