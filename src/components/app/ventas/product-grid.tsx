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

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export function ProductGrid({
  products,
  isZoomed,
  onToggleZoom,
  onProductClick,
}: ProductGridProps) {
  return (
    <div className="min-h-screen pt-32" style={{ backgroundColor: '#ffffff' }}>
      {/* Density control button — below admin header */}
      <div className="fixed top-28 left-8 z-[40]">
        <motion.button
          onClick={onToggleZoom}
          className="h-10 w-10 flex items-center justify-center text-black/40 hover:text-black transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          {isZoomed ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </motion.button>
      </div>

      {/* Product grid */}
      <motion.div
        layout
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: isZoomed ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
          gap: 0,
          padding: '20px 40px',
        }}
        transition={{ layout: springTransition }}
      >
        {products.map((product) => (
          /* ── Rule 2: whileHover scales the ENTIRE card (image + code) ── */
          <motion.button
            key={product.id}
            layout
            onClick={() => onProductClick(product)}
            className="group relative text-left focus:outline-none"
            whileHover={{ scale: 1.05 }}
            transition={{
              layout: springTransition,
              scale: { type: 'spring', stiffness: 400, damping: 25 },
            }}
            style={{ transformOrigin: 'center center' }}
          >
            {/* ── Rule 1: layoutId shared with product-detail ── */}
            <motion.div
              layoutId={`product-image-${product.id}`}
              className="w-full overflow-hidden flex items-center justify-center"
              style={{
                aspectRatio: isZoomed ? '3/4' : '1/1',
                backgroundColor: '#ffffff',
                padding: isZoomed ? '20px' : '10px',
              }}
              transition={{ layout: springTransition }}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>

            {/* Product code — scales together with image via parent whileHover */}
            <motion.div layout className="py-2 text-center" transition={{ layout: springTransition }}>
              <p
                className="text-[11px] tracking-[0.15em] text-black font-medium uppercase"
                style={{ fontFamily: 'monospace, "Courier New", Courier' }}
              >
                {product.code}
              </p>
            </motion.div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
