'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

type CartPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (buyerData: BuyerData) => void;
};

export type BuyerData = {
  alumnoNombre: string;
  alumnoDni: string;
  alumnoEdad: number;
  responsableNombre: string;
  responsableDni: string;
  responsableTelefono: string;
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

const monoFont = { fontFamily: 'monospace, "Courier New", Courier' };

export function CartPanel({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartPanelProps) {
  const [alumnoNombre, setAlumnoNombre] = useState('');
  const [alumnoDni, setAlumnoDni] = useState('');
  const [alumnoEdad, setAlumnoEdad] = useState('');
  const [responsableNombre, setResponsableNombre] = useState('');
  const [responsableDni, setResponsableDni] = useState('');
  const [responsableTelefono, setResponsableTelefono] = useState('');

  const edadNum = parseInt(alumnoEdad) || 0;
  const needsGuardian = edadNum > 0 && edadNum < 18;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const canSubmit = useMemo(() => {
    if (!alumnoNombre.trim() || !alumnoDni.trim() || !alumnoEdad.trim()) return false;
    if (alumnoDni.length !== 8) return false;
    if (needsGuardian) {
      if (!responsableNombre.trim() || !responsableDni.trim() || !responsableTelefono.trim()) return false;
      if (responsableDni.length !== 8) return false;
    }
    return cart.length > 0;
  }, [alumnoNombre, alumnoDni, alumnoEdad, needsGuardian, responsableNombre, responsableDni, responsableTelefono, cart]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCheckout({
      alumnoNombre: alumnoNombre.trim(),
      alumnoDni: alumnoDni.trim(),
      alumnoEdad: edadNum,
      responsableNombre: responsableNombre.trim(),
      responsableDni: responsableDni.trim(),
      responsableTelefono: responsableTelefono.trim(),
    });
    // Reset form
    setAlumnoNombre('');
    setAlumnoDni('');
    setAlumnoEdad('');
    setResponsableNombre('');
    setResponsableDni('');
    setResponsableTelefono('');
  };

  return (
    /* ── Rule 3: AnimatePresence wrapping the entire cart ── */
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[58] bg-black/10"
          />

          {/* ── Cart panel — slides from right with spring physics ── */}
          <motion.div
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springTransition}
            className="fixed top-0 right-0 bottom-0 z-[59] w-full max-w-[700px] overflow-y-auto"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex h-full">
              {/* ─── Left column: Checkout form ─── */}
              <div className="flex-1 p-8 overflow-y-auto border-r border-black/10">
                {/* Close */}
                <motion.button
                  onClick={onClose}
                  className="mb-6 text-black/40 hover:text-black transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>

                {/* ─── Contact: Student data ─── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: 0.1 }}
                >
                  <h3
                    className="text-[11px] tracking-[0.25em] text-black uppercase font-medium mb-4"
                    style={monoFont}
                  >
                    Datos del Alumno
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] text-black/60 uppercase mb-1"
                        style={monoFont}
                      >
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={alumnoNombre}
                        onChange={(e) => setAlumnoNombre(e.target.value)}
                        placeholder="Nombre y apellidos"
                        className="w-full border border-black/20 px-3 py-2 text-[11px] tracking-[0.1em] outline-none focus:border-black transition-colors"
                        style={monoFont}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] text-black/60 uppercase mb-1"
                        style={monoFont}
                      >
                        DNI
                      </label>
                      <input
                        type="text"
                        value={alumnoDni}
                        onChange={(e) => setAlumnoDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                        placeholder="00000000"
                        maxLength={8}
                        className="w-full border border-black/20 px-3 py-2 text-[11px] tracking-[0.1em] outline-none focus:border-black transition-colors"
                        style={monoFont}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      className="block text-[10px] tracking-[0.15em] text-black/60 uppercase mb-1"
                      style={monoFont}
                    >
                      Edad
                    </label>
                    <input
                      type="text"
                      value={alumnoEdad}
                      onChange={(e) => setAlumnoEdad(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      placeholder="Edad"
                      maxLength={2}
                      className="w-24 border border-black/20 px-3 py-2 text-[11px] tracking-[0.1em] outline-none focus:border-black transition-colors"
                      style={monoFont}
                    />
                  </div>
                </motion.div>

                {/* ─── Guardian data (only if < 18) ─── */}
                <AnimatePresence>
                  {needsGuardian && (
                    <motion.div
                      key="guardian-section"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={springTransition}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-black/10 pt-5 mb-5">
                        <h3
                          className="text-[11px] tracking-[0.25em] text-black uppercase font-medium mb-4"
                          style={monoFont}
                        >
                          Datos del Responsable
                        </h3>
                        <p
                          className="text-[9px] tracking-[0.1em] text-black/40 uppercase mb-3"
                          style={monoFont}
                        >
                          Obligatorio para menores de 18 años
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label
                              className="block text-[10px] tracking-[0.15em] text-black/60 uppercase mb-1"
                              style={monoFont}
                            >
                              Nombre del responsable
                            </label>
                            <input
                              type="text"
                              value={responsableNombre}
                              onChange={(e) => setResponsableNombre(e.target.value)}
                              placeholder="Nombre y apellidos"
                              className="w-full border border-black/20 px-3 py-2 text-[11px] tracking-[0.1em] outline-none focus:border-black transition-colors"
                              style={monoFont}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label
                                className="block text-[10px] tracking-[0.15em] text-black/60 uppercase mb-1"
                                style={monoFont}
                              >
                                DNI del responsable
                              </label>
                              <input
                                type="text"
                                value={responsableDni}
                                onChange={(e) => setResponsableDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                placeholder="00000000"
                                maxLength={8}
                                className="w-full border border-black/20 px-3 py-2 text-[11px] tracking-[0.1em] outline-none focus:border-black transition-colors"
                                style={monoFont}
                              />
                            </div>
                            <div>
                              <label
                                className="block text-[10px] tracking-[0.15em] text-black/60 uppercase mb-1"
                                style={monoFont}
                              >
                                Teléfono
                              </label>
                              <input
                                type="text"
                                value={responsableTelefono}
                                onChange={(e) => setResponsableTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                placeholder="999999999"
                                maxLength={9}
                                className="w-full border border-black/20 px-3 py-2 text-[11px] tracking-[0.1em] outline-none focus:border-black transition-colors"
                                style={monoFont}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: 0.2 }}
                  className="mt-4"
                >
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`w-full py-3 text-[11px] tracking-[0.25em] uppercase transition-colors ${
                      canSubmit
                        ? 'bg-black text-white hover:bg-black/80'
                        : 'bg-black/10 text-black/30 cursor-not-allowed'
                    }`}
                    style={monoFont}
                  >
                    Registrar Venta
                  </button>
                </motion.div>
              </div>

              {/* ─── Right column: Order summary ─── */}
              <div className="w-[280px] p-6 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: 0.15 }}
                >
                  <h3
                    className="text-[11px] tracking-[0.25em] text-black uppercase font-medium mb-6"
                    style={monoFont}
                  >
                    Resumen ({totalItems})
                  </h3>

                  {/* Cart items */}
                  <div className="space-y-4 mb-6">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={springTransition}
                          className="flex gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-contain flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[10px] tracking-[0.15em] text-black uppercase font-medium truncate"
                              style={monoFont}
                            >
                              {item.name}
                            </p>
                            <p
                              className="text-[9px] tracking-[0.1em] text-black/50 uppercase"
                              style={monoFont}
                            >
                              Talla: {item.size}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="text-black/40 hover:text-black"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span
                                className="text-[10px] tracking-[0.1em] text-black"
                                style={monoFont}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="text-black/40 hover:text-black"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p
                              className="text-[10px] tracking-[0.1em] text-black"
                              style={monoFont}
                            >
                              S/ {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="mt-1 text-black/30 hover:text-black transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-black/10 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span
                        className="text-[10px] tracking-[0.15em] text-black/60 uppercase"
                        style={monoFont}
                      >
                        Subtotal
                      </span>
                      <span
                        className="text-[10px] tracking-[0.1em] text-black"
                        style={monoFont}
                      >
                        S/ {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-black/10">
                      <span
                        className="text-[11px] tracking-[0.15em] text-black uppercase font-medium"
                        style={monoFont}
                      >
                        Total
                      </span>
                      <span
                        className="text-[11px] tracking-[0.1em] text-black font-medium"
                        style={monoFont}
                      >
                        S/ {subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
