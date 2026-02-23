'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function ReportesPage() {

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
                        <p className="text-yellow-600"><strong>Pagos pendientes:</strong> 12</p>
                        <p className="text-red-600"><strong>Pagos atrasados:</strong> 5</p>
                    </CardContent>
                </Card>
            </div>
            
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
