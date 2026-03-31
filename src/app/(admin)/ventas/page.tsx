'use client';

import { useState, useRef, useEffect } from 'react';
import { products, packages } from '@/lib/data';
import { ShoppingCart, Plus, Minus, X, Star, ArrowRight, Package, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'package';
  image?: string;
};

const promotionalPacks = [
  {
    id: 'promo-1',
    name: 'Pack Matrícula + Uniforme',
    description: 'Inscripción completa con uniforme oficial del club. ¡Ahorra S/ 20!',
    originalPrice: 115.00,
    price: 95.00,
    tag: 'MÁS VENDIDO',
    items: ['Matrícula', 'Camiseta y short oficial'],
    gradient: 'from-amber-500 via-orange-500 to-red-500',
  },
  {
    id: 'promo-2',
    name: 'Pack Bienvenida Completo',
    description: 'Todo lo que necesitas para empezar. Matrícula, uniforme y chaleco.',
    originalPrice: 150.00,
    price: 120.00,
    tag: 'MEJOR VALOR',
    items: ['Matrícula', 'Camiseta y short', 'Chaleco de entrenamiento'],
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
  },
  {
    id: 'promo-3',
    name: 'Pack Verano Elite',
    description: 'Temporada completa de verano con 2 uniformes de entrenamiento.',
    originalPrice: 180.00,
    price: 140.00,
    tag: 'EXCLUSIVO',
    items: ['Temporada Verano', '2x Chaleco entrenamiento', 'Botella de agua'],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
  },
];

const storeProducts = [
  {
    id: 'store-1',
    name: 'Camiseta y Short Oficial',
    description: 'Uniforme oficial del Sporting Club Huaraz',
    price: 55.00,
    images: [
      'https://picsum.photos/seed/uniform-store-1/600/700',
      'https://picsum.photos/seed/uniform-store-2/600/700',
      'https://picsum.photos/seed/uniform-store-3/600/700',
    ],
    category: 'Uniforme',
    badge: 'OFICIAL',
  },
  {
    id: 'store-2',
    name: 'Chaleco de Entrenamiento',
    description: 'Chaleco deportivo azul para entrenamientos',
    price: 35.00,
    images: [
      'https://picsum.photos/seed/vest-store-1/600/700',
      'https://picsum.photos/seed/vest-store-2/600/700',
    ],
    category: 'Entrenamiento',
    badge: 'NUEVO',
  },
  {
    id: 'store-3',
    name: 'Chaleco de Entrenamiento Rojo',
    description: 'Chaleco deportivo rojo edición limitada',
    price: 38.00,
    images: [
      'https://picsum.photos/seed/vest-red-1/600/700',
      'https://picsum.photos/seed/vest-red-2/600/700',
    ],
    category: 'Entrenamiento',
    badge: 'LIMITADO',
  },
  {
    id: 'store-4',
    name: 'Balón de Fútbol N°5',
    description: 'Balón oficial para entrenamientos y partidos',
    price: 80.00,
    images: [
      'https://picsum.photos/seed/ball-1/600/700',
      'https://picsum.photos/seed/ball-2/600/700',
    ],
    category: 'Accesorio',
  },
  {
    id: 'store-5',
    name: 'Kit de Medias Oficial',
    description: 'Par de medias deportivas oficiales del club',
    price: 15.00,
    images: [
      'https://picsum.photos/seed/socks-store-1/600/700',
    ],
    category: 'Accesorio',
  },
  {
    id: 'store-6',
    name: 'Botella de Agua 1L',
    description: 'Botella deportiva de alta resistencia',
    price: 5.00,
    images: [
      'https://picsum.photos/seed/water-1/600/700',
    ],
    category: 'Accesorio',
  },
];

type ViewMode = 'grid-large' | 'grid-small';

export default function VentasPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'packs' | 'products'>('packs');
  const [viewMode, setViewMode] = useState<ViewMode>('grid-large');
  const [selectedProduct, setSelectedProduct] = useState<typeof storeProducts[0] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({
      title: "Agregado al carrito",
      description: `${item.name} se añadió correctamente.`,
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(c => c.id === id ? { ...c, quantity: c.quantity + delta } : c)
        .filter(c => c.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const handleCheckout = () => {
    toast({
      title: "Pedido registrado",
      description: `Total: S/ ${totalPrice.toFixed(2)} — Se generó la solicitud de venta.`,
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const handleProductClick = (product: typeof storeProducts[0]) => {
    setIsZooming(true);
    setSelectedImageIndex(0);
    setTimeout(() => {
      setSelectedProduct(product);
      setIsZooming(false);
    }, 200);
  };

  const handlePrevImage = () => {
    if (!selectedProduct) return;
    setSelectedImageIndex(i => (i - 1 + selectedProduct.images.length) % selectedProduct.images.length);
  };

  const handleNextImage = () => {
    if (!selectedProduct) return;
    setSelectedImageIndex(i => (i + 1) % selectedProduct.images.length);
  };

  // Product detail view (Yeezy style)
  if (selectedProduct) {
    return (
      <div className="relative min-h-screen -m-4 sm:-mx-6 sm:-my-0 bg-white dark:bg-gray-950">
        {/* Back button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-6 left-6 z-30 flex items-center gap-1 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="absolute top-6 right-6 z-30 relative"
        >
          <ShoppingCart className="h-5 w-5 text-black/60 dark:text-white/60" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        <div className="flex flex-col items-center min-h-screen pt-16 pb-10 px-4">
          {/* Product image with navigation */}
          <div className={cn(
            "relative w-full max-w-md transition-all duration-300",
            isZooming ? "scale-105 opacity-0" : "scale-100 opacity-100"
          )}>
            <div className="aspect-[3/4] relative">
              <button
                onClick={handlePrevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <img
                key={selectedImageIndex}
                src={selectedProduct.images[selectedImageIndex]}
                alt={selectedProduct.name}
                className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-300"
              />
              <button
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Image dots */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {selectedProduct.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === selectedImageIndex ? "w-4 bg-black dark:bg-white" : "w-1.5 bg-black/20 dark:bg-white/20"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="w-full max-w-md mt-6 space-y-4 text-center">
            <div>
              <p className="text-lg font-medium text-black dark:text-white">{selectedProduct.name}</p>
              <p className="text-lg text-black/60 dark:text-white/60">S/ {selectedProduct.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => {
                addToCart({
                  id: selectedProduct.id,
                  name: selectedProduct.name,
                  price: selectedProduct.price,
                  type: 'product',
                  image: selectedProduct.images[0],
                });
              }}
              className="w-full max-w-xs mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cart panel */}
        {isCartOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-950 border-l border-black/5 dark:border-white/10 z-50 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5">
                <h2 className="font-medium text-black dark:text-white">Carrito ({totalItems})</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-black/20 dark:text-white/20">
                    <ShoppingCart className="h-10 w-10 mb-2" />
                    <p className="text-sm">Carrito vacío</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border border-black/5 dark:border-white/5 rounded-lg">
                      <div className="h-12 w-12 rounded bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-black/30 dark:text-white/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-black/40 dark:text-white/40">S/ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black/60 dark:text-white/60 hover:border-black/30 dark:hover:border-white/30">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm w-4 text-center text-black dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black/60 dark:text-white/60 hover:border-black/30 dark:hover:border-white/30">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-black/20 dark:text-white/20 hover:text-red-400 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-5 border-t border-black/5 dark:border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50 dark:text-white/50">Total</span>
                    <span className="font-bold text-black dark:text-white">S/ {totalPrice.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                    Registrar Venta
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Main store view
  return (
    <div className="relative min-h-screen -m-4 sm:-mx-6 sm:-my-0 bg-white dark:bg-gray-950">

      {/* Top navigation — Yeezy style */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Section tabs */}
          <div className="flex gap-4 text-sm">
            <button
              onClick={() => setActiveSection('packs')}
              className={cn(
                "transition-colors font-medium tracking-wide",
                activeSection === 'packs'
                  ? "text-black dark:text-white"
                  : "text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60"
              )}
            >
              PAQUETES
            </button>
            <button
              onClick={() => setActiveSection('products')}
              className={cn(
                "transition-colors font-medium tracking-wide",
                activeSection === 'products'
                  ? "text-black dark:text-white"
                  : "text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60"
              )}
            >
              PRODUCTOS
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* View toggle (+ icon like Yeezy) */}
            {activeSection === 'products' && (
              <button
                onClick={() => setViewMode(v => v === 'grid-large' ? 'grid-small' : 'grid-large')}
                className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                title="Cambiar vista"
              >
                {viewMode === 'grid-large' ? (
                  <Plus className="h-5 w-5" />
                ) : (
                  <LayoutGrid className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5 text-black/60 dark:text-white/60" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Promotional Packs */}
        {activeSection === 'packs' && (
          <section className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">Paquetes Promocionales</h2>
              <p className="text-black/40 dark:text-white/40 text-sm">Ahorra con nuestros paquetes especiales.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {promotionalPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="group relative rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/10 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={cn("h-1 bg-gradient-to-r", pack.gradient)} />
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-full bg-gradient-to-r text-white", pack.gradient)}>
                        {pack.tag}
                      </span>
                      <span className="text-black/30 dark:text-white/30 line-through text-xs">S/ {pack.originalPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-black dark:text-white">{pack.name}</h3>
                      <p className="text-xs text-black/40 dark:text-white/40 mt-1">{pack.description}</p>
                    </div>
                    <div className="text-3xl font-black text-black dark:text-white">S/ {pack.price.toFixed(2)}</div>
                    <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                      {pack.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-black/40 dark:text-white/40">
                          <Star className="h-2.5 w-2.5 text-amber-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addToCart({
                        id: pack.id,
                        name: pack.name,
                        price: pack.price,
                        type: 'package',
                      })}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-black dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products — Yeezy style */}
        {activeSection === 'products' && (
          <section className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">Productos</h2>
              <p className="text-black/40 dark:text-white/40 text-sm">Uniformes y equipamiento oficial del club.</p>
            </div>
            <div className={cn(
              "grid gap-x-6 gap-y-10 transition-all duration-300",
              viewMode === 'grid-large'
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-3 md:grid-cols-6"
            )}>
              {storeProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group text-left"
                >
                  {/* Image */}
                  <div className={cn(
                    "relative bg-[#f8f8f8] dark:bg-white/5 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]",
                    viewMode === 'grid-large' ? "aspect-[3/4]" : "aspect-square"
                  )}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && viewMode === 'grid-large' && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/80 backdrop-blur-sm text-[9px] font-bold text-black tracking-widest">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  {viewMode === 'grid-large' ? (
                    <div className="mt-2 space-y-0.5">
                      <p className="text-sm text-black dark:text-white font-medium">{product.name}</p>
                      <p className="text-sm text-black/50 dark:text-white/50">S/ {product.price.toFixed(2)}</p>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <p className="text-xs text-black/60 dark:text-white/60 truncate">{product.name}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-950 border-l border-black/5 dark:border-white/10 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5">
              <h2 className="font-medium text-sm text-black dark:text-white">Carrito ({totalItems})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-black/20 dark:text-white/20">
                  <ShoppingCart className="h-10 w-10 mb-2" />
                  <p className="text-sm">Carrito vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border border-black/5 dark:border-white/5 rounded-lg">
                    <div className="h-12 w-12 rounded bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-5 w-5 text-black/30 dark:text-white/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-black/40 dark:text-white/40">S/ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQuantity(item.id, -1)} className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black/60 dark:text-white/60 hover:border-black/30">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-4 text-center text-black dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black/60 dark:text-white/60 hover:border-black/30">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-black/20 dark:text-white/20 hover:text-red-400 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t border-black/5 dark:border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black/50 dark:text-white/50">Total</span>
                  <span className="font-bold text-black dark:text-white">S/ {totalPrice.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                  Registrar Venta
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
