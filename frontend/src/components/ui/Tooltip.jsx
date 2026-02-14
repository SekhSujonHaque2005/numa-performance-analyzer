import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export default function Tooltip({ content, children }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center gap-1 cursor-help group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <Info className="w-4 h-4 text-scholar-400 opacity-60 group-hover:opacity-100 transition-opacity" />

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-scholar-400/20 rounded-lg shadow-xl z-50 pointer-events-none"
                    >
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-b border-r border-scholar-400/20" />
                        <p className="text-xs text-slate-300 font-serif leading-relaxed">
                            {content}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
