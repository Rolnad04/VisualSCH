'use client';

import { motion } from 'framer-motion';
import { Plus, ChevronLeft } from 'lucide-react';
import type { StoreProduct } from './product-detail';

type ProductGridProps = {
  products: StoreProduct[];
  isZoomed: boolean;
  onToggleZoom: () => void;
  onProductClick: (product: StoreProduct) => void;
  selectedProductId: string | null;
};

// Yeezy Cinematic Transition (Rule: NO spring)
const cinematicTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

export function ProductGrid({
  products,
  isZoomed,
  onToggleZoom,
  onProductClick,
  selectedProductId,
}: ProductGridProps) {
  return (
    <div className="min-h-screen pt-32 bg-white flex items-center justify-center">
      {/* Density control — Hidden when focused to preserve slate aesthetic */}
      <div className="fixed top-28 left-8 z-[40]">
        {!selectedProductId && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onToggleZoom}
            className="h-10 w-10 flex items-center justify-center text-black/40 hover:text-black transition-colors"
          >
            {isZoomed ? <ChevronLeft className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </motion.button>
        )}
      </div>

      {/* ── Rule: THE SLATE (Background Grid) with 4.3x Zoom ── */}
      <motion.div
        animate={{
          scale: selectedProductId ? 4.3 : 1,
          opacity: selectedProductId ? 0 : 1,
        }}
        transition={cinematicTransition}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12 px-4 origin-center"
        style={{ pointerEvents: selectedProductId ? 'none' : 'auto' }}
      >
        {products.map((product) => (
          /* ── Rule: EXACT structure confirmed from Yeezy ── */
          <motion.div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="flex flex-col flex-nowrap items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              layoutId={`img-${product.id}`}
              src={product.images[0]}
              alt={product.code}
              className="w-full h-auto object-contain"
            />
            <p className="mt-4 text-[11px] tracking-[0.2em] font-mono uppercase text-center">
              {product.code}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}


