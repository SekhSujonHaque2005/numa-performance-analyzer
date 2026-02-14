import { motion } from "framer-motion";
import clsx from "clsx";

export default function Card({ children, className, title, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
            className={clsx(
                "bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl",
                className
            )}
        >
            {title && (
                <h3 className="text-xl font-serif font-bold text-scholar-200 mb-4 border-b border-scholar-800/50 pb-2">
                    {title}
                </h3>
            )}
            {children}
        </motion.div>
    );
}
