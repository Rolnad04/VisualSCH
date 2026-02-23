
'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Student } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

type AnunciosDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
};

export default function AnunciosDialog({ open, onOpenChange, students }: AnunciosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Anuncios</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input placeholder="Escribir un mensaje..." />
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
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.dni}</TableCell>
                                    <TableCell>{student.category}</TableCell>
                                    <TableCell>{student.season}</TableCell>
                                    <TableCell>{student.guardian?.name || '-'}</TableCell>
                                    <TableCell>{student.guardian?.phone || student.phone || '-'}</TableCell>
                                </TableRow>
                            ))}
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
