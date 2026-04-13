'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { StoreProduct } from './product-detail';

type ProductGridProps = {
  products: StoreProduct[];
  selectedProductId: string | null;
  onProductClick: (product: StoreProduct, originX: number, originY: number) => void;
};

// ── STRICTLY PROHIBITED: type: "spring" ──
// Cinematic tween only. Dry, fluid, zero bounce.
const cinematicTransition = {
  type: 'tween' as const,
  ease: [0.32, 0.72, 0, 1],
  duration: 0.6,
};

const monoFont = { fontFamily: 'monospace, "Courier New", Courier' };

export function ProductGrid({
  products,
  selectedProductId,
  onProductClick,
}: ProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Anchor calculation: compute click origin relative to the grid container ──
  const handleClick = useCallback(
    (product: StoreProduct, e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const card = e.currentTarget.getBoundingClientRect();
      // Center of card relative to container
      const originX = card.left - containerRect.left + card.width / 2;
      const originY = card.top - containerRect.top + card.height / 2;
      onProductClick(product, originX, originY);
    },
    [onProductClick]
  );

  return (
    /* ── CAPA FONDO: The entire grid zooms 4.3x + fades when a product is selected ── */
    /* ── transformOrigin is applied dynamically by the parent via style prop ── */
    <motion.div
      ref={containerRef}
      animate={{
        scale: selectedProductId ? 4.3 : 1,
        opacity: selectedProductId ? 0 : 1,
      }}
      transition={cinematicTransition}
      className="absolute inset-0 flex items-center justify-center will-change-transform"
      style={{ pointerEvents: selectedProductId ? 'none' : 'auto' }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12 px-4 py-32 max-w-[1400px] w-full">
        {products.map((product) => (
          <motion.div
            key={product.id}
            onClick={(e) => handleClick(product, e)}
            className="flex flex-col flex-nowrap items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            <img
              src={product.images[0]}
              alt={product.code}
              className="w-full aspect-square object-contain"
            />
            <p
              className="mt-4 text-[11px] tracking-[0.2em] uppercase text-center text-black/70"
              style={monoFont}
            >
              {product.code}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
