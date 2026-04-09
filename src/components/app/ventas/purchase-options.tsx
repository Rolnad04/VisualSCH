'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

type PurchaseOptionsProps = {
  isExpanded: boolean;
  onToggle: () => void;
  sizes: string[];
  onSizeSelect: (size: string) => void;
  infoOpen: boolean;
  onInfoToggle: () => void;
  productCode: string;
  productPrice: number;
  productDescription: string[];
};

/* ── Rule 4: Spring physics everywhere ── */
const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

const stiffSpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 22,
};

export function PurchaseOptions({
  isExpanded,
  onToggle,
  sizes,
  onSizeSelect,
  infoOpen,
  onInfoToggle,
  productCode,
  productPrice,
  productDescription,
}: PurchaseOptionsProps) {
  return (
    <div className="w-full text-center">
      {/* ── Rule 3: AnimatePresence for exit animations ── */}
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ─── Collapsed: Code + Price + "+" ─── */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springTransition}
            className="flex flex-col items-center gap-2"
          >
            <p
              className="text-[12px] tracking-[0.2em] text-black uppercase"
              style={{ fontFamily: 'monospace, "Courier New", Courier' }}
            >
              {productCode}
            </p>
            <p
              className="text-[12px] tracking-[0.15em] text-black"
              style={{ fontFamily: 'monospace, "Courier New", Courier' }}
            >
              S/ {productPrice.toFixed(2)}
            </p>

            {/* ── Rule 5: The + button is the ORIGIN of expansion ── */}
            <motion.button
              onClick={onToggle}
              className="mt-1 text-black/60 hover:text-black transition-colors"
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15 }}
              transition={stiffSpring}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          /* ─── Expanded: SELECT SIZE layout ─── */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={springTransition}
            className="flex flex-col items-center gap-3"
          >
            {/* Row 1: ? | SELECT SIZE | X — spring entrance */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...springTransition, delay: 0.03 }}
              className="w-full flex items-center justify-between px-4"
            >
              <motion.button
                /* ── Rule 5: originates from center (+ button position) ── */
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ...stiffSpring, delay: 0.06 }}
                onClick={onInfoToggle}
                className="text-black/60 hover:text-black transition-colors"
              >
                <span
                  className="text-[12px] tracking-[0.1em]"
                  style={{ fontFamily: 'monospace, "Courier New", Courier' }}
                >
                  ?
                </span>
              </motion.button>

              <span
                className="text-[11px] tracking-[0.25em] text-black uppercase font-medium"
                style={{ fontFamily: 'monospace, "Courier New", Courier' }}
              >
                SELECT SIZE
              </span>

              <motion.button
                /* ── Rule 5: originates from center (+ button position) ── */
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ...stiffSpring, delay: 0.06 }}
                onClick={onToggle}
                className="text-black/60 hover:text-black transition-colors"
                whileTap={{ scale: 0.85 }}
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </motion.div>

            {/* Row 2: Price */}
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...springTransition, delay: 0.08 }}
              className="text-[12px] tracking-[0.15em] text-black"
              style={{ fontFamily: 'monospace, "Courier New", Courier' }}
            >
              S/ {productPrice.toFixed(2)}
            </motion.p>

            {/* Row 3: Sizes or Description (info panel) */}
            {/* ── Rule 3: AnimatePresence for exit animation on sizes ↔ info ── */}
            <AnimatePresence mode="wait">
              {!infoOpen ? (
                <motion.div
                  key="sizes-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={springTransition}
                  className="w-full flex items-center justify-center gap-8"
                >
                  {sizes.map((size, index) => (
                    /* ── Rule 5: each size starts BEHIND the + button origin ── */
                    <motion.button
                      key={`size-${size}`}
                      initial={{
                        scale: 0,
                        opacity: 0,
                        y: -20,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        scale: 0,
                        opacity: 0,
                        y: -20,
                      }}
                      transition={{
                        ...stiffSpring,
                        delay: index * 0.05 + 0.1,
                      }}
                      onClick={() => onSizeSelect(size)}
                      className="text-black/70 hover:text-black transition-colors"
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span
                        className="text-[12px] tracking-[0.1em]"
                        style={{ fontFamily: 'monospace, "Courier New", Courier' }}
                      >
                        {size}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                /* ── Rule 3: AnimatePresence exit on info panel ── */
                <motion.div
                  key="info-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={springTransition}
                  onClick={onInfoToggle}
                  className="cursor-pointer w-full py-1"
                >
                  {productDescription.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: i * 0.04 }}
                      className="text-[11px] tracking-[0.15em] text-black uppercase leading-relaxed"
                      style={{ fontFamily: 'monospace, "Courier New", Courier' }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Row 4: INFORMATION toggle — only when sizes visible */}
            <AnimatePresence>
              {!infoOpen && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ ...springTransition, delay: 0.2 }}
                  onClick={onInfoToggle}
                  className="mt-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <span
                    className="text-[11px] tracking-[0.25em] text-black uppercase font-medium"
                    style={{ fontFamily: 'monospace, "Courier New", Courier' }}
                  >
                    Information
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
