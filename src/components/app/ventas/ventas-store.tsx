'use client';

import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

import { ProductGrid } from './product-grid';
import { ProductDetail, type StoreProduct } from './product-detail';
import { CartPanel, type CartItem } from './cart-panel';
import { type TicketImprimibleProps } from '@/components/app/TicketImprimible';

// Lazy-load del ticket — solo se descarga cuando el usuario completa un checkout.
// ssr: false porque usa window.print() y estilos @media print que son exclusivos del cliente.
const TicketImprimible = dynamic(
  () => import('@/components/app/TicketImprimible'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20 font-mono text-sm text-gray-400">
        Preparando ticket…
      </div>
    ),
  }
);

// ── STRICTLY PROHIBITED: type: "spring" ──
const cinematicTransition = {
  type: 'tween' as const,
  ease: [0.32, 0.72, 0, 1],
  duration: 0.6,
};

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

  // ── Anchor origin for grid zoom: dynamically set transformOrigin ──
  const [zoomOrigin, setZoomOrigin] = useState<string>('center center');
  const gridRef = useRef<HTMLDivElement>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ticket state — datos para el comprobante post-checkout
  const [ticketData, setTicketData] = useState<TicketImprimibleProps | null>(null);

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

      // ── RULE 5: automatically open Order Summary panel ──
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

    // Generar datos para el ticket de pago
    const items = cart.map((c) => `${c.name} (x${c.quantity})`).join(', ');
    setTicketData({
      nombreAlumno: buyerData.alumnoNombre as string,
      dni: buyerData.alumnoDni as string,
      montoPagado: totalPrice,
      fecha: new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      nroOperacion: 'OP-' + Date.now().toString().slice(-6),
      concepto: items || 'Venta de productos',
    });

    toast({
      title: 'Pedido registrado',
      description: `Total: S/ ${totalPrice.toFixed(2)} — Se generó la solicitud de venta.`,
    });
    setCart([]);
    setIsCartOpen(false);
  }, [cart, toast]);

  // ─── Navigation handlers ─────────────────────────────────────────
  const handleProductClick = useCallback((product: StoreProduct, originX: number, originY: number) => {
    // ── RULE 3 / Anchor: set transformOrigin dynamically from click coordinates ──
    setZoomOrigin(`${originX}px ${originY}px`);
    setSelectedProduct(product);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedProduct(null);
    setIsCartOpen(false);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────
  return (
    /* ── RULE 1: Sandbox container — relative w-full h-full overflow-hidden bg-[#F5F5F5] ── */
    <div className="relative w-full h-[calc(100vh-6rem)] overflow-hidden bg-[#F5F5F5]">

      {/* ── LayoutGroup: enables shared layoutId between Grid and Detail ──
           This is CRITICAL for the FLIP flight animation.
           The Grid (Layer 2) and the Detail Overlay (Layer 3) must be siblings
           inside the same LayoutGroup so motion can interpolate the image
           position/size via the shared layoutId.
      */}
      <LayoutGroup>

        {/* ── ESQUINA SUP. IZQUIERDA: back (<) when detail is open, otherwise nothing ── */}
        <AnimatePresence>
          {selectedProduct ? (
            <motion.button
              key="back-btn"
              onClick={handleBack}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={cinematicTransition}
              className="absolute top-6 left-6 z-50 text-xl font-light cursor-pointer
                         text-black/50 hover:text-black transition-colors"
              style={{ fontFamily: 'monospace' }}
            >
              {'<'}
            </motion.button>
          ) : null}
        </AnimatePresence>

        {/* ── ESQUINA SUP. DERECHA: Cart icon — absolute, NEVER fixed ── */}
        <motion.button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="absolute top-6 right-6 z-50 text-black/60 hover:text-black transition-colors cursor-pointer"
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

        {/* ── CAPA FONDO (Layer 2): Grid Canvas — zooms 4.3x from anchor + fades ──
             The Grid contains <motion.img> elements with layoutId={product.id}.
             transformOrigin is injected dynamically based on click position.
        */}
        <div ref={gridRef} className="absolute inset-0" style={{ transformOrigin: zoomOrigin }}>
          <ProductGrid
            products={storeProducts}
            selectedProductId={selectedProduct?.id || null}
            onProductClick={handleProductClick}
          />
        </div>

        {/* ── CAPA FRONTAL (Layer 3): Detail Overlay — RENDERED INDEPENDENTLY ──
             RULE 3: This AnimatePresence is a SIBLING of the grid, NOT nested inside it.
             This allows the <motion.img> with matching layoutId to "fly" from its
             grid position to the centered detail position without being distorted
             by the grid's scale: 4.3 zoom animation.
             RULE 4: On exit, the overlay fades out in the center (exit={{ opacity: 0 }}).
             The image does NOT fly back to the grid.
        */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductDetail
              key={selectedProduct.id}
              product={selectedProduct}
              onBack={handleBack}
              onAddToCart={addToCart}
            />
          )}
        </AnimatePresence>

      </LayoutGroup>

      {/* ── Cart Panel (slides from right, INSIDE container) ── */}
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      {/* ── Overlay del Ticket de Pago (post-checkout) ────────────────── */}
      <AnimatePresence>
        {ticketData && (
          <motion.div
            key="ticket-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[100] overflow-auto bg-white"
          >
            {/* Barra superior: Volver a la tienda */}
            <div className="no-print-ticket sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white/90 px-5 py-3 backdrop-blur-sm">
              <button
                id="btn-cerrar-ticket"
                type="button"
                onClick={() => setTicketData(null)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm font-medium text-gray-700 transition hover:bg-gray-100 active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la Tienda
              </button>
            </div>

            {/* El ticket */}
            <TicketImprimible {...ticketData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
