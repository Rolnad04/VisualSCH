'use client';

import { motion, AnimatePresence } from 'framer-motion';

type InfoPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
  description: string;
  category: string;
};

export function InfoPanel({ isOpen, onToggle, description, category }: InfoPanelProps) {
  return (
    <div className="relative w-full">
      {/* "INFORMACIÓN" trigger */}
      <button
        onClick={onToggle}
        className="w-full text-center py-3"
      >
        <span className="text-[11px] tracking-[0.25em] text-black/30 uppercase hover:text-black/60 transition-colors">
          Información
        </span>
      </button>

      {/* Sliding panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{
              type: 'tween',
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
            onClick={onToggle}
            className="absolute bottom-full left-0 right-0 bg-white pb-3 cursor-pointer"
          >
            <div className="space-y-3 px-2">
              <p className="text-[12px] text-black/50 leading-relaxed">
                {description}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.2em] text-black/25 uppercase">
                  {category}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
