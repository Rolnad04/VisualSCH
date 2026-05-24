'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileSearch, AlertTriangle, ArrowLeft, Printer, UserX } from 'lucide-react';
import { students as allStudents } from '@/lib/data';
import { categories } from '@/lib/data';
import { ReportsService, type ReportParams } from '@/lib/reports-service';
import type { Student } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function formatDebt(amount: number | undefined): string {
    if (!amount || amount === 0) return '—';
    return `S/ ${amount.toFixed(2)}`;
}

function getBadgeClass(status: Student['paymentStatus']): string {
    switch (status) {
        case 'Inactivo': return 'badge-inactivo';
        case 'Deuda pendiente': return 'badge-deuda';
        default: return '';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Datos filtrados (constante de módulo — no se recalculan en cada render)
// ─────────────────────────────────────────────────────────────────────────────
const alumnosSuspendidos: Student[] = allStudents.filter(
    (s) => s.paymentStatus === 'Inactivo' || s.isActive === false
);

const fechaImpresion = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────
export default function ReportesPage() {
    // ── Vista activa ──────────────────────────────────────────────────────────
    const [vistaActiva, setVistaActiva] = useState<'menu' | 'suspendidos'>('menu');

    // ── Estado del reporte de morosidad ──────────────────────────────────────
    const [reportParams, setReportParams] = useState<ReportParams>({
        category: 'all',
        month: 'all',
    });

    const morososReport = useMemo(() => {
        return ReportsService.getMorososReport(allStudents, reportParams);
    }, [reportParams]);

    const handleParamChange = (key: keyof ReportParams, value: string) => {
        setReportParams(prev => ({ ...prev, [key]: value }));
    };

    // ══════════════════════════════════════════════════════════════════════════
    // VISTA: SUSPENDIDOS
    // ══════════════════════════════════════════════════════════════════════════
    if (vistaActiva === 'suspendidos') {
        return (
            <>
                {/*
          ── Estilos de impresión ────────────────────────────────────────────
          Solo #print-area es visible al imprimir; el resto (sidebar, header,
          botones) queda invisible sin afectar el layout del admin.
        */}
                <style>{`
          /* ── 1. Configuración física de la hoja A4 ── */
          @page {
            size: A4;
            margin: 15mm 10mm 15mm 10mm;
          }

          @media print {
            /* ── 2. Aislamiento del área de impresión ── */
            body * { visibility: hidden !important; }
            #print-area,
            #print-area * { visibility: visible !important; }
            #print-area {
              position: absolute;
              inset: 0;
              margin: 0;
              padding: 0;
            }

            /* ── 3. Forzar colores de fondo en impresión ── */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .no-print { display: none !important; }

            /* ── 4. Cabecera repetida en cada página ── */
            thead { display: table-header-group; }

            /* ── 5. Evitar corte de filas entre páginas ── */
            tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }

          /* ── Badges (visibles tanto en pantalla como en impresión) ── */
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.03em;
            white-space: nowrap;
          }
          .badge-inactivo { background: #fee2e2; color: #991b1b; }
          .badge-deuda    { background: #fef3c7; color: #92400e; }
        `}</style>

                {/* ── Barra superior de navegación (solo pantalla) ─────────────── */}
                <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
                    <Button
                        id="btn-volver"
                        variant="outline"
                        onClick={() => setVistaActiva('menu')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Reportes
                    </Button>

                    <Button
                        id="btn-imprimir"
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-transform"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir / Exportar PDF
                    </Button>
                </div>

                {/* ══════════════════════════════════════════════════════════════════
            ÁREA DE IMPRESIÓN
        ══════════════════════════════════════════════════════════════════ */}
                <div
                    id="print-area"
                    className="
            bg-white text-black
            w-full rounded-lg border border-gray-200 shadow-sm
            print:m-0 print:max-w-full print:rounded-none print:shadow-none print:border-0
          "
                >
                    {/* ── Encabezado del documento ─────────────────────────────────── */}
                    <header className="border-b-2 border-black px-6 py-4 print:px-4 print:py-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                    Sporting Club Huaraz
                                </p>
                                <h1 className="mt-0.5 text-2xl font-black uppercase tracking-tight text-black print:text-xl">
                                    Reporte de Alumnos Suspendidos
                                </h1>
                                <p className="mt-1 text-xs text-gray-500">
                                    Documento generado el <strong>{fechaImpresion}</strong>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold uppercase text-gray-500">Total suspendidos</p>
                                <p className="text-4xl font-black text-red-600 print:text-3xl">
                                    {alumnosSuspendidos.length}
                                </p>
                            </div>
                        </div>
                        <p className="mt-2 text-[0.65rem] leading-snug text-gray-400">
                            Criterio: alumnos con estado &laquo;Inactivo&raquo;, &laquo;Deuda pendiente&raquo;
                            o con <code>isActive = false</code>.
                        </p>
                    </header>

                    {/* ── Tabla ────────────────────────────────────────────────────── */}
                    <main className="px-6 py-4 print:px-4 print:py-3">
                        {alumnosSuspendidos.length === 0 ? (
                            <p className="py-10 text-center text-sm text-gray-500">
                                No hay alumnos suspendidos actualmente.
                            </p>
                        ) : (
                            <table className="w-full table-fixed border-collapse text-sm">
                                <thead>
                                    <tr className="border-b-2 border-black bg-gray-100 print:bg-gray-200">
                                        <th scope="col" className="w-8 py-2 pr-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700">#</th>
                                        <th scope="col" className="w-28 py-2 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">DNI</th>
                                        <th scope="col" className="py-2 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Nombre completo</th>
                                        <th scope="col" className="w-24 py-2 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Categoría</th>
                                        <th scope="col" className="w-28 py-2 pr-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700">Estado</th>
                                        <th scope="col" className="w-24 py-2 text-right text-xs font-bold uppercase tracking-wider text-gray-700">Deuda (S/)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnosSuspendidos.map((alumno, index) => (
                                        <tr
                                            key={alumno.id}
                                            className="border-b border-gray-200 odd:bg-white even:bg-gray-50 print:odd:bg-white print:even:bg-gray-100"
                                        >
                                            <td className="py-2 pr-2 align-middle text-xs text-gray-400">{index + 1}</td>
                                            <td className="py-2 pr-3 align-middle font-mono text-xs font-medium text-gray-800">{alumno.dni}</td>
                                            <td className="truncate py-2 pr-3 align-middle font-semibold text-gray-900">{alumno.name}</td>
                                            <td className="py-2 pr-3 align-middle text-xs text-gray-700">{alumno.category}</td>
                                            <td className="py-2 pr-3 text-right align-middle">
                                                <span className={`badge ${getBadgeClass(alumno.paymentStatus)}`}>
                                                    {alumno.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-2 text-right align-middle font-mono text-xs font-semibold text-red-700">
                                                {formatDebt(alumno.debtAmount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-black">
                                        <td colSpan={5} className="py-2 pr-3 text-right text-xs font-bold uppercase text-gray-700">
                                            Deuda total acumulada
                                        </td>
                                        <td className="py-2 text-right font-mono text-sm font-black text-red-700">
                                            {formatDebt(
                                                alumnosSuspendidos.reduce((acc, s) => acc + (s.debtAmount ?? 0), 0),
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </main>

                    {/* ── Pie del documento ────────────────────────────────────────── */}
                    <footer className="border-t border-gray-200 px-6 py-3 print:px-4 print:py-2">
                        <p className="text-[0.6rem] text-gray-400">
                            Documento confidencial · Uso interno exclusivo · Sporting Club Huaraz · {fechaImpresion}
                        </p>
                    </footer>
                </div>
            </>
        );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // VISTA: MENÚ PRINCIPAL
    // ══════════════════════════════════════════════════════════════════════════
    return (
        <div className="space-y-6">
            {/* ── Cabecera ─────────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Reportes</h1>
                    <p className="text-muted-foreground">Analiza el rendimiento de la academia con reportes detallados.</p>
                </div>
                <Button><Download className="mr-2 h-4 w-4" /> Exportar Reporte General</Button>
            </div>

            {/* ── Tarjetas de reportes ─────────────────────────────────────────── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Ventas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reporte de Ventas</CardTitle>
                        <CardDescription>Ventas de productos y uniformes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Total vendido del día:</strong> S/ 250.00</p>
                        <p><strong>Total vendido del mes:</strong> S/ 3,450.00</p>
                        <p><strong>Productos vendidos (mes):</strong> 42</p>
                        <p><strong>Producto más vendido:</strong> Camiseta y short</p>
                        <p><strong>Promotora del mes:</strong> Sofia Rodriguez</p>
                    </CardContent>
                </Card>

                {/* Inscripciones */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reporte de Inscripciones</CardTitle>
                        <CardDescription>Nuevos alumnos registrados.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Inscripciones del día:</strong> 3</p>
                        <p><strong>Inscripciones del mes:</strong> 25</p>
                        <p><strong>Total acumulado:</strong> 128</p>
                        <p><strong>Promotora con más registros:</strong> Sofia Rodriguez</p>
                    </CardContent>
                </Card>

                {/* Mensualidades */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reporte de Mensualidades</CardTitle>
                        <CardDescription>Estado de los pagos mensuales.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Pagos del día:</strong> S/ 450.00</p>
                        <p><strong>Pagos del mes:</strong> S/ 8,900.00</p>
                        <p className="text-yellow-600"><strong>Pagos pendientes:</strong> 0</p>
                        <p className="text-red-600"><strong>Pagos atrasados:</strong> 0</p>
                    </CardContent>
                </Card>

                {/* ── Tarjeta: Alumnos Suspendidos ─────────────────────────────── */}
                <Card
                    id="card-suspendidos"
                    className="
            border-red-200 bg-red-50/50
            transition-shadow hover:shadow-md
            dark:border-red-900/40 dark:bg-red-950/20
          "
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <UserX className="h-5 w-5" />
                            Alumnos Suspendidos
                        </CardTitle>
                        <CardDescription>
                            Listado imprimible de alumnos inactivos o con deuda pendiente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 rounded-md bg-red-100/60 px-3 py-2 dark:bg-red-900/20">
                            <span className="text-3xl font-black text-red-600">{alumnosSuspendidos.length}</span>
                            <span className="text-xs text-red-700 dark:text-red-400">
                                alumno{alumnosSuspendidos.length !== 1 ? 's' : ''} en esta condición
                            </span>
                        </div>
                        <Button
                            id="btn-ver-suspendidos"
                            variant="destructive"
                            className="w-full"
                            onClick={() => setVistaActiva('suspendidos')}
                        >
                            <UserX className="mr-2 h-4 w-4" />
                            Ver Reporte Completo
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* ── Reporte de Morosidad (Stored Procedure Parametrizado) ────────── */}
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Reporte de Morosidad
                            </CardTitle>
                            <CardDescription>
                                Consulta parametrizada — Emulación de Stored Procedure{' '}
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                    [dbo].[GetAlumnosMorososReport]
                                </code>
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {morososReport.length} resultado{morososReport.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filtros parametrizados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">@Category</label>
                            <Select value={reportParams.category} onValueChange={(v) => handleParamChange('category', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {categories.map(c => (
                                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">@Month</label>
                            <Select value={reportParams.month} onValueChange={(v) => handleParamChange('month', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Mes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los meses</SelectItem>
                                    {meses.map(m => (
                                        <SelectItem key={m} value={m} className="capitalize">
                                            {m.charAt(0).toUpperCase() + m.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setReportParams({ category: 'all', month: 'all' })}
                            >
                                Limpiar Parámetros
                            </Button>
                        </div>
                    </div>

                    {/* Tabla de resultados */}
                    {morososReport.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>DNI</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Deuda</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {morososReport.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.dni}</TableCell>
                                        <TableCell>{student.category}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={student.paymentStatus === 'Deuda pendiente' ? 'destructive' : 'default'}
                                                className={student.paymentStatus === 'Próximo a vencer' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : ''}
                                            >
                                                {student.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            S/ {(student.debtAmount || 0).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileSearch className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p>No se encontraron alumnos morosos con los parámetros seleccionados.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Reporte General ──────────────────────────────────────────────── */}
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Reporte General</CardTitle>
                    <CardDescription>Resumen financiero total de la academia.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold">Totales del Día</h4>
                        <div className="p-3 bg-muted rounded-md space-y-1 text-sm">
                            <p className="flex justify-between"><span>Uniformes:</span> <span>S/ 55.00</span></p>
                            <p className="flex justify-between"><span>Inscripciones:</span> <span>S/ 150.00</span></p>
                            <p className="flex justify-between"><span>Mensualidades:</span> <span>S/ 450.00</span></p>
                            <hr className="my-1" />
                            <p className="flex justify-between font-bold text-base"><span>TOTAL GENERAL:</span> <span>S/ 655.00</span></p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Totales del Mes</h4>
                        <div className="p-3 bg-muted rounded-md space-y-1 text-sm">
                            <p className="flex justify-between"><span>Uniformes:</span> <span>S/ 1,250.00</span></p>
                            <p className="flex justify-between"><span>Inscripciones:</span> <span>S/ 2,500.00</span></p>
                            <p className="flex justify-between"><span>Mensualidades:</span> <span>S/ 8,900.00</span></p>
                            <hr className="my-1" />
                            <p className="flex justify-between font-bold text-base"><span>TOTAL GENERAL:</span> <span>S/ 12,650.00</span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
