'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type StoreProduct = {
  id: string;
  name: string;
  code: string;
  description: string[];
  price: number;
  images: string[];
  category: string;
  sizes: string[];
};

type ProductDetailProps = {
  product: StoreProduct;
  onBack: () => void;
  onAddToCart: (product: StoreProduct, size: string) => void;
};

// ── STRICTLY PROHIBITED: type: "spring" ──
const cinematicTransition = {
  type: 'tween' as const,
  ease: [0.32, 0.72, 0, 1] as number[],
  duration: 0.6,
};

const monoFont = { fontFamily: 'monospace, "Courier New", Courier' };

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setIsExpanded(false);
  }, [product.id]);

  const handleBack = () => {
    setIsExpanded(false);
    onBack();
  };

  // ── FLUJO 1-CLIC: clicking a size DIRECTLY adds to cart ──
  const handleSizeClick = (size: string) => {
    onAddToCart(product, size);
  };

  return (
    /* ── CAPA FRONTAL: Overlay estático centrado con inset-0 ── */
    <motion.div
      className="absolute inset-0 z-[40] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#F5F5F5' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={cinematicTransition}
    >
      {/* ── Product Image: FORCED max-h-[55vh] ── */}
      <img
        src={product.images[0]}
        alt={product.code}
        className="max-h-[55vh] w-auto max-w-[80%] object-contain"
      />

      {/* ── UI Below Image: Code, Price, + / Sizes ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.08 } }}
        transition={{ ...cinematicTransition, delay: 0.15 }}
        className="mt-8 flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* ── Collapsed state: Code + Price + "+" button ── */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col items-center gap-2"
            >
              <p
                className="text-[12px] tracking-[0.2em] text-black uppercase"
                style={monoFont}
              >
                {product.code}
              </p>
              <p
                className="text-[12px] tracking-[0.15em] text-black"
                style={monoFont}
              >
                S/ {product.price.toFixed(2)}
              </p>

              {/* ── The + Button: opens size selector ── */}
              <motion.button
                onClick={() => setIsExpanded(true)}
                className="mt-2 text-black/60 hover:text-black transition-colors text-3xl font-light cursor-pointer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'tween', duration: 0.15 }}
              >
                +
              </motion.button>
            </motion.div>
          ) : (
            /* ── Expanded state: size numbers with direct purchase on click ── */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              {/* ── Size numbers: DIRECT onClick = add to cart ── */}
              <div className="flex items-center justify-center gap-8">
                {product.sizes.map((size, index) => (
                  <motion.button
                    key={`size-${size}`}
                    initial={{ scale: 0, opacity: 0, y: -15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -15 }}
                    transition={{
                      type: 'tween',
                      ease: [0.32, 0.72, 0, 1],
                      duration: 0.35,
                      delay: index * 0.05 + 0.08,
                    }}
                    onClick={() => handleSizeClick(size)}
                    className="text-black/60 hover:text-black transition-colors cursor-pointer"
                    whileHover={{ scale: 1.35 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-[14px] tracking-[0.1em]" style={monoFont}>
                      {size}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* ── Close × to collapse back ── */}
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'tween', duration: 0.25, delay: 0.2 }}
                onClick={() => setIsExpanded(false)}
                className="text-black/40 hover:text-black transition-colors cursor-pointer"
                whileTap={{ scale: 0.85 }}
              >
                <span className="text-sm" style={monoFont}>×</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
