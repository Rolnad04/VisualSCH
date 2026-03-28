'use client';

import { useState, useRef, useEffect } from 'react';
import { products, packages } from '@/lib/data';
import { ShoppingCart, Plus, Minus, X, Sparkles, Star, Zap, ArrowRight, Package } from 'lucide-react';
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
    image: 'https://picsum.photos/seed/uniform-store/400/500',
    category: 'Uniforme',
    badge: 'OFICIAL',
  },
  {
    id: 'store-2',
    name: 'Chaleco de Entrenamiento',
    description: 'Chaleco deportivo azul para entrenamientos',
    price: 35.00,
    image: 'https://picsum.photos/seed/vest-store/400/500',
    category: 'Entrenamiento',
    badge: 'NUEVO',
  },
  {
    id: 'store-3',
    name: 'Chaleco de Entrenamiento Rojo',
    description: 'Chaleco deportivo rojo edición limitada',
    price: 38.00,
    image: 'https://picsum.photos/seed/vest-red/400/500',
    category: 'Entrenamiento',
    badge: 'LIMITADO',
  },
  {
    id: 'store-4',
    name: 'Kit de Medias Oficial',
    description: 'Par de medias deportivas oficiales del club',
    price: 15.00,
    image: 'https://picsum.photos/seed/socks-store/400/500',
    category: 'Accesorio',
  },
];

export default function VentasPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'packs' | 'products'>('packs');

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

  return (
    <div className="relative min-h-screen -m-4 sm:-mx-6 sm:-my-0">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
      <div className="fixed inset-0 -z-10 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 255, 0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1), transparent 50%)' }} />

      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-12 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Sporting Club Huaraz
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
            TIENDA
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              OFICIAL
            </span>
          </h1>
          <p className="text-white/40 text-lg max-w-md mx-auto font-light">
            Uniformes, equipamiento y paquetes exclusivos para nuestros alumnos.
          </p>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveSection('packs')}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeSection === 'packs'
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <Package className="inline h-4 w-4 mr-1.5 -mt-0.5" />
              Paquetes
            </button>
            <button
              onClick={() => setActiveSection('products')}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeSection === 'products'
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              Productos
            </button>
          </div>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-[10px] text-white font-bold flex items-center justify-center animate-in zoom-in duration-200">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {/* Promotional Packs */}
        {activeSection === 'packs' && (
          <section className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Paquetes Promocionales</h2>
              <p className="text-white/40">Ahorra con nuestros paquetes especiales diseñados para ti.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {promotionalPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Gradient top bar */}
                  <div className={cn("h-1.5 bg-gradient-to-r", pack.gradient)} />
                  
                  <div className="p-6 space-y-5">
                    {/* Tag */}
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-full bg-gradient-to-r text-white", pack.gradient)}>
                        {pack.tag}
                      </span>
                      <span className="text-white/30 line-through text-sm">S/ {pack.originalPrice.toFixed(2)}</span>
                    </div>

                    {/* Name & Price */}
                    <div>
                      <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                      <p className="text-white/40 text-sm mt-1">{pack.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">S/ {pack.price.toFixed(2)}</span>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      {pack.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-white/50">
                          <Star className="h-3 w-3 text-amber-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Add to cart button */}
                    <button
                      onClick={() => addToCart({
                        id: pack.id,
                        name: pack.name,
                        price: pack.price,
                        type: 'package',
                      })}
                      className={cn(
                        "w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r transition-all duration-300",
                        pack.gradient,
                        "hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                      )}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        {activeSection === 'products' && (
          <section className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Productos</h2>
              <p className="text-white/40">Uniformes y equipamiento oficial del club.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {storeProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-white/20"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  style={{
                    transform: hoveredProduct === product.id ? 'perspective(800px) rotateY(-2deg) translateY(-4px)' : 'perspective(800px) rotateY(0deg) translateY(0px)',
                    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white tracking-wider border border-white/20">
                        {product.badge}
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          type: 'product',
                          image: product.image,
                        })}
                        className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar — S/ {product.price.toFixed(2)}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-1">
                    <p className="text-xs text-white/30 uppercase tracking-wider">{product.category}</p>
                    <h3 className="text-sm font-semibold text-white">{product.name}</h3>
                    <p className="text-lg font-bold text-white">S/ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-950 border-l border-white/10 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-white/60" />
                <h2 className="text-lg font-bold text-white">Carrito</h2>
                <span className="text-sm text-white/40">({totalItems} items)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-white/60" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-3">
                  <ShoppingCart className="h-12 w-12" />
                  <p className="text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-white/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-sm text-white/40">S/ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Minus className="h-3 w-3 text-white/60" />
                      </button>
                      <span className="text-sm text-white w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus className="h-3 w-3 text-white/60" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Total</span>
                  <span className="text-2xl font-bold text-white">S/ {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-semibold text-sm hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
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
