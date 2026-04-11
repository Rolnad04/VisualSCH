'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

import { ProductGrid } from './product-grid';
import { ProductDetail, type StoreProduct } from './product-detail';
import { CartPanel, type CartItem } from './cart-panel';

// ─── Product data with sizes ─────────────────────────────────────────────
const storeProducts: StoreProduct[] = [
  {
    id: 'store-1',
    name: 'Camiseta y Short Oficial',
    code: 'UN-01',
    description: [
      'Uniforme oficial del Sporting Club Huaraz',
      'Camiseta de poliéster con sublimación completa',
      'Short con elástico reforzado',
    ],
    price: 55.0,
    images: [
      'https://picsum.photos/seed/uniform-store-1/600/600',
      'https://picsum.photos/seed/uniform-store-2/600/600',
      'https://picsum.photos/seed/uniform-store-3/600/600',
    ],
    category: 'Uniforme',
    sizes: ['1', '2', '3', '4'],
  },
  {
    id: 'store-2',
    name: 'Chaleco de Entrenamiento',
    code: 'CH-01',
    description: [
      'Chaleco deportivo azul para entrenamientos',
      'Tela microfibra transpirable',
      'Escudo bordado',
    ],
    price: 35.0,
    images: [
      'https://picsum.photos/seed/vest-store-1/600/600',
      'https://picsum.photos/seed/vest-store-2/600/600',
    ],
    category: 'Entrenamiento',
    sizes: ['1', '2', '3', '4'],
  },
  {
    id: 'store-3',
    name: 'Chaleco Entrenamiento Rojo',
    code: 'CH-02',
    description: [
      'Chaleco deportivo rojo edición limitada',
      'Material dry-fit de alta resistencia',
    ],
    price: 38.0,
    images: [
      'https://picsum.photos/seed/vest-red-1/600/600',
      'https://picsum.photos/seed/vest-red-2/600/600',
    ],
    category: 'Entrenamiento',
    sizes: ['1', '2', '3', '4'],
  },
  {
    id: 'store-4',
    name: 'Balón de Fútbol N°5',
    code: 'BL-01',
    description: [
      'Balón oficial para entrenamientos',
      'Peso reglamentario',
      'Costura térmica',
    ],
    price: 80.0,
    images: [
      'https://picsum.photos/seed/ball-1/600/600',
      'https://picsum.photos/seed/ball-2/600/600',
    ],
    category: 'Accesorio',
    sizes: ['4', '5'],
  },
  {
    id: 'store-5',
    name: 'Kit de Medias Oficial',
    code: 'MD-01',
    description: [
      'Par de medias deportivas oficiales',
      'Tejido antibacterial',
      'Refuerzo en talón y puntera',
    ],
    price: 15.0,
    images: ['https://picsum.photos/seed/socks-store-1/600/600'],
    category: 'Accesorio',
    sizes: ['1', '2', '3'],
  },
  {
    id: 'store-6',
    name: 'Botella de Agua 1L',
    code: 'BT-01',
    description: [
      'Botella deportiva de alta resistencia',
      'Material BPA-free',
      'Capacidad 1 litro',
    ],
    price: 5.0,
    images: ['https://picsum.photos/seed/water-1/600/600'],
    category: 'Accesorio',
    sizes: ['1'],
  },
];

// ─── Root Store Component ────────────────────────────────────────────────
export function VentasStore() {
  const { toast } = useToast();

  // View state
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ─── Cart handlers ───────────────────────────────────────────────
  const addToCart = useCallback(
    (product: StoreProduct, size: string) => {
      const itemId = `${product.id}-${size}`;
      setCart((prev) => {
        const existing = prev.find((c) => c.id === itemId);
        if (existing) {
          return prev.map((c) =>
            c.id === itemId ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        return [
          ...prev,
          {
            id: itemId,
            name: product.name,
            price: product.price,
            quantity: 1,
            size,
            image: product.images[0],
          },
        ];
      });

      // Open ORDER SUMMARY panel automatically
      setIsCartOpen(true);

      toast({
        title: 'Agregado al carrito',
        description: `${product.name} (Talla ${size}) se añadió correctamente.`,
      });
    },
    [toast]
  );

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleCheckout = useCallback((buyerData: Record<string, unknown>) => {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    toast({
      title: 'Pedido registrado',
      description: `Total: S/ ${totalPrice.toFixed(2)} — Se generó la solicitud de venta.`,
    });
    setCart([]);
    setIsCartOpen(false);
  }, [cart, toast]);

  // ─── Navigation handlers ─────────────────────────────────────────
  const handleProductClick = useCallback((product: StoreProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedProduct(null);
    setIsCartOpen(false);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────
  return (
    /* ── LayoutGroup: required for cross-component layoutId animation ── */
    <LayoutGroup>
      {/* ── Layer 1: THE VIEWPORT — relative w-full h-full (NOT h-screen, NOT fixed) ── */}
      {/* ── Scoped to this component's container. Never escapes to global viewport. ── */}
      <div className="relative w-full h-[calc(100vh-6rem)] overflow-hidden bg-white">
        {/* Layer 2: Grid Canvas (zooms 4.3x + fades on select) */}
        <ProductGrid
          products={storeProducts}
          selectedProductId={selectedProduct?.id || null}
          onProductClick={handleProductClick}
        />

        {/* Layer 3: Detail Overlay (layoutId image flight + UI) */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductDetail
              key={selectedProduct.id}
              product={selectedProduct}
              onBack={handleBack}
              onAddToCart={addToCart}
              isCartOpen={isCartOpen}
            />
          )}
        </AnimatePresence>

        {/* ── Cart Badge — absolute within container, NEVER fixed ── */}
        <motion.button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="absolute bottom-8 right-8 z-[50] text-black/60 hover:text-black transition-colors"
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'tween', duration: 0.15 }}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="absolute -top-2 -right-2 h-3.5 w-3.5 bg-black text-white text-[8px] font-bold flex items-center justify-center rounded-full"
              >
                {totalItems}
              </motion.span>
            )}
          </div>
        </motion.button>

        {/* Cart Panel (slides from right, INSIDE container) */}
        <CartPanel
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
        />
      </div>
    </LayoutGroup>
  );
}
