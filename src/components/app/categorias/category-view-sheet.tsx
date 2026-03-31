import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { Category, Professor } from '@/lib/types';
import { students } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Clock, Calendar, Sun } from 'lucide-react';

type CategoryViewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  professors: Professor[];
};

export default function CategoryViewSheet({ open, onOpenChange, category, professors }: CategoryViewSheetProps) {
  if (!category) return null;
  
  const categoryStudents = students.filter(s => s.category === category.name);
  const categoryProfessors = professors.filter(p => category.professors.includes(p.name));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalles: {category.name}</SheetTitle>
          <SheetDescription>
            Información completa de la categoría, horarios y alumnos inscritos.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
            {/* Professors + Schedule highlight */}
            <div className="rounded-xl border bg-primary/5 p-4 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                <span className="font-semibold text-sm">Profesores:</span>
                <div className="flex flex-wrap gap-1">
                  {categoryProfessors.map(p => (
                    <Badge key={p.id} variant="secondary">{p.name}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Días activos</p>
                    <p className="font-medium">{category.schedule.days.join(' · ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Horario</p>
                    <p className="font-medium">{category.schedule.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duración por clase</p>
                    <p className="font-medium">{category.schedule.durationPerClass}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Frecuencia</p>
                    <p className="font-medium">{category.schedule.frequency}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <p><strong className="font-medium">Deporte:</strong> {category.sport}</p>
                    <p><strong className="font-medium">Rango de edad:</strong> {category.ageRange[0]} - {category.ageRange[1]} años</p>
                    <p><strong className="font-medium">Cupo Máximo:</strong> {category.maxCapacity}</p>
                    <p><strong className="font-medium">Alumnos Inscritos:</strong> {category.enrolledStudents}</p>
                    <p><strong className="font-medium">Precio mensual:</strong> S/ {category.price.toFixed(2)}</p>
                </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="font-semibold mb-2">Alumnos Inscritos ({categoryStudents.length})</h3>
                <div className="border rounded-md">
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Edad</TableHead>
                            <TableHead>Estado de Pago</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categoryStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={student.photoUrl} />
                                            <AvatarFallback>{student.name[0]}</AvatarFallback>
                                        </Avatar>
                                        {student.name}
                                    </TableCell>
                                    <TableCell>{student.age}</TableCell>
                                    <TableCell>{student.paymentStatus}</TableCell>
                                </TableRow>
                            ))}
                            {categoryStudents.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                                  Sin alumnos inscritos en esta categoría.
                                </TableCell>
                              </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
