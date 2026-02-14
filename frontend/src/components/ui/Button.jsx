import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function Button({
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = "primary",
    className
}) {

    const baseStyles = "px-6 py-2 rounded-lg font-serif font-medium transition-all shadow-md flex items-center justify-center gap-2 relative overflow-hidden group";

    const variants = {
        primary: "bg-scholar-600 hover:bg-scholar-500 text-white border border-scholar-400/30",
        secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-500/30",
        outline: "bg-transparent border border-scholar-400 text-scholar-300 hover:bg-scholar-900/40",
        danger: "bg-red-900/50 hover:bg-red-800/60 text-red-200 border border-red-700/50"
    };

    return (
        <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled || loading}
            className={twMerge(baseStyles, variants[variant], (disabled || loading) && "opacity-50 cursor-not-allowed", className)}
        >
            {/* Glossy sheen effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </motion.button>
    );
}
