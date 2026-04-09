'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PurchaseOptions } from './purchase-options';

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

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSizeSelect = (size: string) => {
    onAddToCart(product, size);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((i) => (i - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((i) => (i + 1) % product.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[50] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Back button — below admin header */}
      <motion.button
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springTransition}
        onClick={onBack}
        className="absolute top-16 left-5 z-10 text-black hover:text-black/60 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center w-full max-w-[520px] px-6">
        {/* Product image with navigation arrows */}
        <div className="relative w-full flex items-center">
          {/* Left arrow */}
          {product.images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-[-60px] z-10 text-black/30 hover:text-black transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* ── Rule 1: SAME layoutId as grid → Framer interpolates size+position ── */}
          <motion.div
            layoutId={`product-image-${product.id}`}
            className="w-full flex items-center justify-center"
            style={{ aspectRatio: '1/1', backgroundColor: '#ffffff' }}
            transition={{ layout: springTransition }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="max-w-[80%] max-h-[80%] object-contain"
              />
            </AnimatePresence>
          </motion.div>

          {/* Right arrow */}
          {product.images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-[-60px] z-10 text-black/30 hover:text-black transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Pagination dots */}
        {product.images.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`h-1 w-1 rounded-full transition-colors ${
                  i === currentImageIndex ? 'bg-black' : 'bg-black/20'
                }`}
              />
            ))}
          </motion.div>
        )}

        {/* Purchase options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.15 }}
          className="mt-6 w-full"
        >
          <PurchaseOptions
            isExpanded={optionsExpanded}
            onToggle={() => {
              setOptionsExpanded(!optionsExpanded);
              setInfoOpen(false);
            }}
            sizes={product.sizes}
            onSizeSelect={handleSizeSelect}
            infoOpen={infoOpen}
            onInfoToggle={() => setInfoOpen(!infoOpen)}
            productCode={product.code}
            productPrice={product.price}
            productDescription={product.description}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
