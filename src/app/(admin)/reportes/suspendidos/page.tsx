import type { Metadata } from 'next';
import type { Student } from '@/lib/types';
import { students } from '@/lib/data';
import { PrintButton } from '@/components/app/PrintButton';

// ---------------------------------------------------------------------------
// Metadata SEO
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: 'Reporte de Alumnos Suspendidos | Sporting Club Huaraz',
  description:
    'Listado oficial de alumnos con estado Inactivo o Deuda pendiente en el Sporting Club Huaraz.',
};

// ---------------------------------------------------------------------------
// Filtro de alumnos suspendidos
// Incluye: isActive === false  ó  paymentStatus ∈ {'Inactivo', 'Deuda pendiente'}
// ---------------------------------------------------------------------------
const alumnosSuspendidos: Student[] = students.filter(
  (s) =>
    s.isActive === false ||
    s.paymentStatus === 'Inactivo' ||
    s.paymentStatus === 'Deuda pendiente',
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDebt(amount: number | undefined): string {
  if (!amount || amount === 0) return '—';
  return `S/ ${amount.toFixed(2)}`;
}

function getStatusBadgeClass(status: Student['paymentStatus']): string {
  switch (status) {
    case 'Inactivo':
      return 'badge-inactivo';
    case 'Deuda pendiente':
      return 'badge-deuda';
    default:
      return '';
  }
}

// ---------------------------------------------------------------------------
// Page Component (Server Component — sin 'use client')
// ---------------------------------------------------------------------------
export default function SuspendidosPage() {
  const fechaImpresion = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/*
        ── Estilos de impresión ──────────────────────────────────────────────
        Se inyectan aquí para no depender del layout (admin) al imprimir.
        @media print oculta todo excepto #print-area.
      */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area,
          #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute;
            inset: 0;
            margin: 0;
            padding: 0;
          }
          .no-print { display: none !important; }
          thead { display: table-header-group; }
          tr    { page-break-inside: avoid; }
        }

        /* Badge inline sin Tailwind dinámico */
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .badge-inactivo {
          background: #fee2e2;
          color: #991b1b;
        }
        .badge-deuda {
          background: #fef3c7;
          color: #92400e;
        }
      `}</style>

      {/* ── Contenedor de pantalla (se oculta en impresión, sirve de marco) ── */}
      <div className="min-h-screen bg-gray-50 p-6 print:bg-white print:p-0">

        {/* ── Botón de impresión (solo pantalla) ─────────────────────────── */}
        <div className="no-print mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Vista previa — Reporte de Alumnos Suspendidos
          </h1>
          <PrintButton />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ÁREA DE IMPRESIÓN — este div es el único visible al imprimir
        ══════════════════════════════════════════════════════════════════ */}
        <div
          id="print-area"
          className="
            bg-white text-black
            mx-auto w-full max-w-4xl
            rounded-lg shadow-sm
            print:m-0 print:max-w-full print:rounded-none print:shadow-none
          "
        >
          {/* ── Encabezado del documento ─────────────────────────────────── */}
          <header className="border-b-2 border-black px-6 py-4 print:px-4 print:py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 print:text-gray-700">
                  Sporting Club Huaraz
                </p>
                <h1 className="mt-0.5 text-2xl font-black uppercase tracking-tight text-black print:text-xl">
                  Reporte de Alumnos Suspendidos
                </h1>
                <p className="mt-1 text-xs text-gray-500 print:text-gray-700">
                  Documento generado el <strong>{fechaImpresion}</strong>
                </p>
              </div>

              {/* Totalizador */}
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-gray-500 print:text-gray-700">
                  Total suspendidos
                </p>
                <p className="text-4xl font-black text-red-600 print:text-3xl">
                  {alumnosSuspendidos.length}
                </p>
              </div>
            </div>

            {/* Leyenda de criterios */}
            <p className="mt-2 text-[0.65rem] leading-snug text-gray-400 print:text-gray-600">
              Criterio de inclusión: alumnos con estado &laquo;Inactivo&raquo;,
              &laquo;Deuda pendiente&raquo; o con <code>isActive = false</code>.
            </p>
          </header>

          {/* ── Cuerpo ───────────────────────────────────────────────────── */}
          <main className="px-6 py-4 print:px-4 print:py-3">
            {alumnosSuspendidos.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">
                No hay alumnos suspendidos actualmente.
              </p>
            ) : (
              <table className="w-full table-fixed border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-black bg-gray-100 print:bg-gray-200">
                    <th
                      scope="col"
                      className="w-8 py-2 pr-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="w-28 py-2 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      DNI
                    </th>
                    <th
                      scope="col"
                      className="py-2 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      Nombre completo
                    </th>
                    <th
                      scope="col"
                      className="w-24 py-2 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      Categoría
                    </th>
                    <th
                      scope="col"
                      className="w-24 py-2 text-right text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="w-24 py-2 text-right text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      Deuda (S/)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosSuspendidos.map((alumno, index) => (
                    <tr
                      key={alumno.id}
                      className="border-b border-gray-200 transition-colors odd:bg-white even:bg-gray-50 print:odd:bg-white print:even:bg-gray-100"
                    >
                      {/* Nro. */}
                      <td className="py-2 pr-2 align-middle text-xs text-gray-400">
                        {index + 1}
                      </td>

                      {/* DNI */}
                      <td className="py-2 pr-3 align-middle font-mono text-xs font-medium text-gray-800">
                        {alumno.dni}
                      </td>

                      {/* Nombre — truncate evita quiebre de línea */}
                      <td className="truncate py-2 pr-3 align-middle font-semibold text-gray-900">
                        {alumno.name}
                      </td>

                      {/* Categoría */}
                      <td className="py-2 pr-3 align-middle text-xs text-gray-700">
                        {alumno.category}
                      </td>

                      {/* Estado */}
                      <td className="py-2 text-right align-middle">
                        <span className={`badge ${getStatusBadgeClass(alumno.paymentStatus)}`}>
                          {alumno.paymentStatus}
                        </span>
                      </td>

                      {/* Deuda */}
                      <td className="py-2 text-right align-middle font-mono text-xs font-semibold text-red-700">
                        {formatDebt(alumno.debtAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* ── Pie de tabla: totales ─────────────────────────────── */}
                <tfoot>
                  <tr className="border-t-2 border-black">
                    <td
                      colSpan={5}
                      className="py-2 pr-3 text-right text-xs font-bold uppercase text-gray-700"
                    >
                      Deuda total acumulada
                    </td>
                    <td className="py-2 text-right font-mono text-sm font-black text-red-700">
                      {formatDebt(
                        alumnosSuspendidos.reduce(
                          (acc, s) => acc + (s.debtAmount ?? 0),
                          0,
                        ),
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </main>

          {/* ── Pie del documento ────────────────────────────────────────── */}
          <footer className="border-t border-gray-200 px-6 py-3 print:px-4 print:py-2">
            <p className="text-[0.6rem] text-gray-400 print:text-gray-600">
              Documento confidencial · Uso interno exclusivo · Sporting Club Huaraz ·{' '}
              {fechaImpresion}
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
