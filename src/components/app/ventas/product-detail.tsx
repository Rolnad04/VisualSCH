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
  isCartOpen: boolean;
};

// ── STRICTLY PROHIBITED: type: "spring" ──
const cinematicTransition = {
  type: 'tween' as const,
  ease: [0.32, 0.72, 0, 1] as number[],
  duration: 0.6,
};

const delayedUI = {
  type: 'tween' as const,
  ease: [0.32, 0.72, 0, 1] as number[],
  duration: 0.4,
  delay: 0.4,
};

const monoFont = { fontFamily: 'monospace, "Courier New", Courier' };

export function ProductDetail({ product, onBack, onAddToCart, isCartOpen }: ProductDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setIsExpanded(false);
    setSelectedSize(null);
    setShowInfo(false);
  }, [product.id]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize);
  };

  const handleBack = () => {
    setIsExpanded(false);
    setSelectedSize(null);
    setShowInfo(false);
    onBack();
  };

  const cartShift = isCartOpen ? -175 : 0;

  return (
    /* ── Detail overlay: layered ABOVE the zooming grid ── */
    <motion.div className="absolute inset-0 z-[40]">
      {/* ── White backdrop: fades in/out separately so the layoutId image flight is visible ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
        className="absolute inset-0 bg-white"
      />

      {/* ── Content layer (above backdrop) ── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        {/* ── Back Button < (absolute within container, NOT fixed) ── */}
        <motion.button
          onClick={handleBack}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={delayedUI}
          className="absolute top-8 left-8 text-xl font-light cursor-pointer
                     text-black/50 hover:text-black transition-colors"
        >
          {'<'}
        </motion.button>

        {/* ── Content wrapper: shifts left when cart panel opens ── */}
        <motion.div
          animate={{ x: cartShift }}
          transition={cinematicTransition}
          className="flex flex-col items-center"
        >
          {/* ── Product Image (layoutId flight from grid → center) ── */}
          {/* ── max-h-[60vh]: ensures space below for UI ── */}
          <motion.img
            layoutId={`product-img-${product.id}`}
            src={product.images[0]}
            alt={product.code}
            className="max-h-[60vh] w-auto max-w-[80%] object-contain"
            transition={cinematicTransition}
          />

          {/* ── UI Below Image: Code, Price, +, Sizes, ADD TO CART ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={delayedUI}
            className="mt-8 flex flex-col items-center"
          >
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                /* ── Collapsed: Code + Price + big "+" ── */
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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

                  {/* ── The + Button: ORIGIN of size expansion ── */}
                  <motion.button
                    onClick={() => setIsExpanded(true)}
                    className="mt-2 text-black/60 hover:text-black transition-colors text-3xl font-light"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: 'tween', duration: 0.15 }}
                  >
                    +
                  </motion.button>
                </motion.div>
              ) : (
                /* ── Expanded: SELECT SIZE + Sizes + ADD TO CART ── */
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'tween', duration: 0.2 }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Header: ? | SELECT SIZE | × */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'tween', duration: 0.3, delay: 0.05 }}
                    className="flex items-center gap-8"
                  >
                    <motion.button
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.4, delay: 0.08 }}
                      onClick={() => setShowInfo(!showInfo)}
                      className="text-black/50 hover:text-black transition-colors"
                    >
                      <span className="text-[12px] tracking-[0.1em]" style={monoFont}>?</span>
                    </motion.button>

                    <span
                      className="text-[11px] tracking-[0.25em] text-black uppercase font-medium"
                      style={monoFont}
                    >
                      SELECT SIZE
                    </span>

                    <motion.button
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.4, delay: 0.08 }}
                      onClick={() => {
                        setIsExpanded(false);
                        setSelectedSize(null);
                      }}
                      className="text-black/50 hover:text-black transition-colors"
                      whileTap={{ scale: 0.85 }}
                    >
                      <span className="text-sm" style={monoFont}>×</span>
                    </motion.button>
                  </motion.div>

                  {/* Price */}
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.3, delay: 0.1 }}
                    className="text-[12px] tracking-[0.15em] text-black"
                    style={monoFont}
                  >
                    S/ {product.price.toFixed(2)}
                  </motion.p>

                  {/* Sizes or Info panel */}
                  <AnimatePresence mode="wait">
                    {!showInfo ? (
                      <motion.div
                        key="sizes"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: 'tween', duration: 0.2 }}
                        className="flex items-center justify-center gap-8"
                      >
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
                              delay: index * 0.05 + 0.12,
                            }}
                            onClick={() => handleSizeSelect(size)}
                            className={`transition-colors ${
                              selectedSize === size
                                ? 'text-black font-bold underline underline-offset-4'
                                : 'text-black/60 hover:text-black'
                            }`}
                            whileHover={{ scale: 1.25 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="text-[12px] tracking-[0.1em]" style={monoFont}>
                              {size}
                            </span>
                          </motion.button>
                        ))}
                      </motion.div>
                    ) : (
                      /* ── Info panel (replaces sizes) ── */
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
                        onClick={() => setShowInfo(false)}
                        className="cursor-pointer py-1 max-w-xs"
                      >
                        {product.description.map((line, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              type: 'tween',
                              ease: [0.32, 0.72, 0, 1],
                              duration: 0.3,
                              delay: i * 0.04,
                            }}
                            className="text-[11px] tracking-[0.15em] text-black uppercase leading-relaxed text-center"
                            style={monoFont}
                          >
                            {line}
                          </motion.p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* INFORMATION toggle */}
                  <AnimatePresence>
                    {!showInfo && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.3, delay: 0.2 }}
                        onClick={() => setShowInfo(true)}
                        className="mt-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span
                          className="text-[11px] tracking-[0.25em] text-black uppercase font-medium"
                          style={monoFont}
                        >
                          Information
                        </span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* ── ADD TO CART — ONLY appears after a size is selected ── */}
                  <AnimatePresence>
                    {selectedSize && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
                        onClick={handleAddToCart}
                        className="mt-4 px-8 py-3 bg-black text-white
                                   text-[11px] tracking-[0.25em] uppercase
                                   hover:bg-black/80 transition-colors"
                        style={monoFont}
                        whileTap={{ scale: 0.97 }}
                      >
                        Add to Cart
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
