'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileSearch, AlertTriangle } from 'lucide-react';
import { students as allStudents } from '@/lib/data';
import { categories } from '@/lib/data';
import { ReportsService, type ReportParams } from '@/lib/reports-service';

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export default function ReportesPage() {
    const [reportParams, setReportParams] = useState<ReportParams>({
        category: 'all',
        month: 'all',
    });

    // Ejecuta el "Stored Procedure" parametrizado cada vez que cambian los filtros
    const morososReport = useMemo(() => {
        return ReportsService.getMorososReport(allStudents, reportParams);
    }, [reportParams]);

    const handleParamChange = (key: keyof ReportParams, value: string) => {
        setReportParams(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Reportes</h1>
                    <p className="text-muted-foreground">Analiza el rendimiento de la academia con reportes detallados.</p>
                </div>
                <Button><Download className="mr-2 h-4 w-4" /> Exportar Reporte General</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            </div>

            {/* ── Reporte de Morosidad (Stored Procedure Parametrizado) ──────── */}
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Reporte de Morosidad
                            </CardTitle>
                            <CardDescription>
                                Consulta parametrizada — Emulación de Stored Procedure <code className="text-xs bg-muted px-1 py-0.5 rounded">[dbo].[GetAlumnosMorososReport]</code>
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
                                        <SelectItem key={m} value={m} className="capitalize">{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>
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
                                            <Badge variant={student.paymentStatus === 'Deuda pendiente' ? 'destructive' : 'default'}
                                                className={student.paymentStatus === 'Próximo a vencer' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : ''}>
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
    )
}
