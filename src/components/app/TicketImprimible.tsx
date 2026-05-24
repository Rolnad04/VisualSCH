'use client';

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface TicketImprimibleProps {
    /** Nombre completo del alumno */
    nombreAlumno: string;
    /** DNI del alumno o apoderado */
    dni: string;
    /** Monto pagado (en soles) */
    montoPagado: number;
    /** Fecha del pago – se muestra tal cual */
    fecha: string;
    /** Número de operación o referencia */
    nroOperacion: string;
    /** Concepto del pago (opcional, default: 'Mensualidad') */
    concepto?: string;
    /** Categoría deportiva del alumno (opcional) */
    categoria?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const SEPARATOR = '─'.repeat(36);
const DOT_LINE = '· '.repeat(18);

function formatSoles(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function TicketImprimible({
    nombreAlumno,
    dni,
    montoPagado,
    fecha,
    nroOperacion,
    concepto = 'Mensualidad',
    categoria,
}: TicketImprimibleProps) {
    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════
                CSS — Estilos de impresión para hardware térmico 80mm
            ═══════════════════════════════════════════════════════════════ */}
            <style>{`
                /* ── 1. Configuración de papel térmico ─────────────────── */
                @page {
                    margin: 0;
                    size: 80mm auto;
                }

                @media print {
                    /* ── 2. Reset global de impresión ──────────────────── */
                    html, body {
                        width: 80mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    /* ── 3. Aislar solo el ticket ─────────────────────── */
                    #ticket-imprimible,
                    #ticket-imprimible * {
                        visibility: visible !important;
                    }

                    #ticket-imprimible {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 80mm !important;
                        margin: 0 !important;
                        padding: 2mm 3mm !important;
                        box-sizing: border-box !important;

                        /* Bloque tradicional — Flexbox falla en
                           algunos drivers POS / navegadores legacy */
                        display: block !important;
                    }

                    /* ── 4. Tipografía de alto contraste ──────────────── */
                    #ticket-imprimible {
                        font-family:
                            'Courier New', Courier, 'Lucida Console',
                            'Liberation Mono', monospace !important;
                        font-size: 11px !important;
                        line-height: 1.35 !important;
                        color: #000 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* ── 5. Nombres largos bajan de línea ─────────────── */
                    #ticket-imprimible .ticket-value {
                        overflow-wrap: break-word !important;
                        word-break: break-all !important;
                        white-space: normal !important;
                    }

                    /* ── 6. Ocultar botón ─────────────────────────────── */
                    .no-print-ticket {
                        display: none !important;
                    }

                    /* ── 7. Evitar cortes de página dentro del ticket ─── */
                    #ticket-imprimible {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>

            {/* ═══════════════════════════════════════════════════════════════
                Wrapper — centra el ticket en pantalla con fondo gris
            ═══════════════════════════════════════════════════════════════ */}
            <div className="flex min-h-[50vh] flex-col items-center justify-start py-8">

                {/* ── Botón de impresión (solo pantalla) ────────────────── */}
                <button
                    id="btn-imprimir-ticket"
                    type="button"
                    onClick={() => window.print()}
                    className="
                        no-print-ticket
                        mb-5 inline-flex items-center gap-2
                        rounded-lg bg-gray-900 px-5 py-2.5
                        font-mono text-sm font-semibold text-white
                        shadow-md transition
                        hover:bg-gray-800 active:scale-95
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0
                               012-2h16a2 2 0 012 2v5a2 2 0
                               01-2 2h-2m-6 0v4H9v-4h6z"
                        />
                    </svg>
                    Imprimir Ticket
                </button>

                {/* ═══════════════════════════════════════════════════════════
                    EL TICKET — id="ticket-imprimible"
                    En pantalla: recibo visual con borde punteado
                    En impresión: contenido aislado a 80mm de ancho
                ═══════════════════════════════════════════════════════════ */}
                <div
                    id="ticket-imprimible"
                    className="
                        w-[320px] rounded-sm
                        border-2 border-dashed border-gray-400
                        bg-white px-5 py-4
                        font-mono text-[12px] leading-snug text-black
                        shadow-lg
                    "
                >
                    {/* ── Encabezado ────────────────────────────────────── */}
                    <div className="text-center">
                        <p className="text-[15px] font-extrabold tracking-tight">
                            SPORTING CLUB HUARAZ
                        </p>
                        <p className="mt-0.5 text-[9px] text-gray-500">
                            Academia de Fútbol
                        </p>
                        <p className="mt-0.5 text-[9px] text-gray-500">
                            RUC: 20XXXXXXXX1 · Jr. Ejemplo 123
                        </p>
                        <p className="mt-1 text-[10px] font-semibold">
                            COMPROBANTE DE PAGO
                        </p>
                    </div>

                    {/* ── Separador ─────────────────────────────────────── */}
                    <p className="my-1.5 text-center text-gray-300" aria-hidden="true">
                        {SEPARATOR}
                    </p>

                    {/* ── Datos del pago ────────────────────────────────── */}
                    <div className="space-y-1">
                        <Row label="Fecha" value={fecha} />
                        <Row label="Nro. Oper." value={nroOperacion} />
                    </div>

                    <p className="my-1.5 text-center text-gray-300" aria-hidden="true">
                        {DOT_LINE}
                    </p>

                    {/* ── Datos del alumno ──────────────────────────────── */}
                    <div className="space-y-1">
                        <Row label="Alumno" value={nombreAlumno} />
                        {categoria && <Row label="Categoría" value={categoria} />}
                    </div>

                    <p className="my-1.5 text-center text-gray-300" aria-hidden="true">
                        {DOT_LINE}
                    </p>

                    {/* ── Concepto y monto ──────────────────────────────── */}
                    <div className="space-y-1">
                        <Row label="Concepto" value={concepto} />
                    </div>

                    <p className="my-1.5 text-center text-gray-300" aria-hidden="true">
                        {SEPARATOR}
                    </p>

                    {/* ── TOTAL ─────────────────────────────────────────── */}
                    <div className="flex items-baseline justify-between">
                        <span className="text-[13px] font-extrabold">TOTAL</span>
                        <span className="text-[16px] font-black">
                            {formatSoles(montoPagado)}
                        </span>
                    </div>

                    <p className="my-1.5 text-center text-gray-300" aria-hidden="true">
                        {SEPARATOR}
                    </p>

                    {/* ── Pie del ticket ────────────────────────────────── */}
                    <div className="mt-1 text-center">
                        <p className="text-[9px] text-gray-500">
                            ¡Gracias por su pago!
                        </p>
                        <p className="mt-0.5 text-[8px] text-gray-400">
                            Este comprobante es su constancia de pago.
                        </p>
                        <p className="mt-0.5 text-[8px] text-gray-400">
                            Conserve este ticket para cualquier reclamo.
                        </p>
                    </div>

                    {/* ── Cortador visual ───────────────────────────────── */}
                    <p
                        className="mt-3 text-center text-gray-300"
                        aria-hidden="true"
                    >
                        ✂ {SEPARATOR}
                    </p>
                </div>
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: fila label → valor
// ─────────────────────────────────────────────────────────────────────────────
interface RowProps {
    label: string;
    value: string;
}

function Row({ label, value }: RowProps) {
    return (
        <div className="flex justify-between gap-2">
            <span className="shrink-0 text-gray-500">{label}:</span>
            <span className="ticket-value text-right font-semibold break-all">
                {value}
            </span>
        </div>
    );
}
