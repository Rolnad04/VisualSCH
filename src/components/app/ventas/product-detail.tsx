'use client';

import { motion } from 'framer-motion';

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

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white"
    >
      {/* ── Rule: BACK BUTTON (Top-Left) ── */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-xl font-light cursor-pointer z-[70]"
      >
        {'<'}
      </button>

      {/* ── Rule: IMAGE CLONE (layoutId image) ── */}
      <motion.div className="flex flex-col items-center justify-center w-full max-w-lg mt-12">
        {/* max-h-[55vh] OBLIGATORIO para dejar espacio limpio abajo */}
        <motion.img
          layoutId={`img-${product.id}`}
          src={product.images[0]}
          alt={product.code}
          className="w-auto max-h-[55vh] object-contain"
        />
      </motion.div>

      {/* ── Rule: UI DETAILED IN CLEAN COLUMN ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8 flex flex-col items-center space-y-3"
      >
        <p className="text-xs font-mono font-medium uppercase tracking-tight">
          {product.code}
        </p>
        <p className="text-xs font-mono">S/ {product.price.toFixed(2)}</p>
        <button className="text-2xl font-light mt-2 hover:opacity-50 transition-opacity">
          +
        </button>
      </motion.div>
    </motion.div>
  );
}
