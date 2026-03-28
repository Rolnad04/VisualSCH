'use client';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AlumnosTableProps = {
  students: Student[];
  onViewStudent: (student: Student) => void;
};

const statusVariant = {
    'Al día': 'bg-green-500/20 text-green-700 border-green-500/30',
    'Deuda pendiente': 'bg-red-500/20 text-red-700 border-red-500/30',
    'Próximo a vencer': 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
}

export default function AlumnosTable({ students, onViewStudent }: AlumnosTableProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Foto</span>
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead className="hidden md:table-cell">Temporada</TableHead>
              <TableHead>Estado de Pago</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="hidden sm:table-cell">
                  <Avatar>
                    <AvatarImage src={student.photoUrl} alt={student.name} />
                    <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.dni}</TableCell>
                <TableCell className="hidden md:table-cell">{student.category}</TableCell>
                <TableCell className="hidden md:table-cell">{student.season}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", statusVariant[student.paymentStatus])}>
                    {student.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onViewStudent(student)} title="Ver Ficha">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver Ficha</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {students.length === 0 && (
            <div className="text-center p-10 text-muted-foreground">
                No se encontraron alumnos con los filtros aplicados.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
