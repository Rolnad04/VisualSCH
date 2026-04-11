'use client';

import { motion } from 'framer-motion';
import type { StoreProduct } from './product-detail';

type ProductGridProps = {
  products: StoreProduct[];
  selectedProductId: string | null;
  onProductClick: (product: StoreProduct) => void;
};

// ── STRICTLY PROHIBITED: type: "spring" ──
// Cinematic tween only. Dry, fluid, zero bounce.
const cinematicTransition = {
  type: 'tween' as const,
  ease: [0.32, 0.72, 0, 1],
  duration: 0.6,
};

export function ProductGrid({
  products,
  selectedProductId,
  onProductClick,
}: ProductGridProps) {
  return (
    /* ── .canvas-grid: The entire grid zooms + fades when a product is selected ── */
    <motion.div
      animate={{
        scale: selectedProductId ? 4.3 : 1,
        opacity: selectedProductId ? 0 : 1,
      }}
      transition={cinematicTransition}
      className="absolute inset-0 flex items-center justify-center origin-center will-change-transform"
      style={{ pointerEvents: selectedProductId ? 'none' : 'auto' }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12 px-4 py-32 max-w-[1400px] w-full">
        {products.map((product) => (
          <motion.div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="flex flex-col flex-nowrap items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            {/* ── layoutId: shared with ProductDetail for cross-component flight ── */}
            {/* ── CRITICAL: opacity 0 on the INSTANT this product is selected ── */}
            {/* ── This kills the ghost — the layoutId clone takes full control ── */}
            <motion.img
              layoutId={`product-img-${product.id}`}
              src={product.images[0]}
              alt={product.code}
              className="w-full aspect-square object-contain"
              style={{
                opacity: selectedProductId === product.id ? 0 : 1,
              }}
              transition={cinematicTransition}
            />
            <p className="mt-4 text-[11px] tracking-[0.2em] font-mono uppercase text-center text-black/70">
              {product.code}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
