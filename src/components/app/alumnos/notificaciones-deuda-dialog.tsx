
'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Student } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';

type NotificacionesDeudaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
};

export default function NotificacionesDeudaDialog({ open, onOpenChange, students }: NotificacionesDeudaDialogProps) {
  
  const studentsWithDebt = useMemo(() => {
    return students.filter(s => s.paymentStatus === 'Deuda pendiente');
  }, [students]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Notificaciones de Deuda</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div className='flex justify-between items-center'>
                <p className="text-sm text-muted-foreground">Nota: Asegúrate de permitir ventanas emergentes para el envío masivo.</p>
                <Button>Enviar Masivo</Button>
            </div>
            <ScrollArea className="h-72">
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Alumno</TableHead>
                                <TableHead>DNI</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Temporada</TableHead>
                                <TableHead>Apoderado</TableHead>
                                <TableHead>Número</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsWithDebt.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.dni}</TableCell>
                                    <TableCell>{student.category}</TableCell>
                                    <TableCell>{student.season}</TableCell>
                                    <TableCell>{student.guardian?.name || '-'}</TableCell>
                                    <TableCell>{student.guardian?.phone || student.phone || '-'}</TableCell>
                                </TableRow>
                            ))}
                              {studentsWithDebt.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No hay alumnos con deudas pendientes en la selección actual.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button>Imprimir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
