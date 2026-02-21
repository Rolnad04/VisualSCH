import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { Category } from '@/lib/types';
import { students } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type CategoryViewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onEdit: (category: Category) => void;
};

export default function CategoryViewSheet({ open, onOpenChange, category, onEdit }: CategoryViewSheetProps) {
  if (!category) return null;
  
  const categoryStudents = students.filter(s => s.category === category.name);
  
  const handleEditClick = () => {
    onOpenChange(false);
    onEdit(category);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalles de la Categoría: {category.name}</SheetTitle>
          <SheetDescription>
            Información detallada de la categoría y los alumnos inscritos.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <p><strong className="font-medium">Deporte:</strong> {category.sport}</p>
                    <p><strong className="font-medium">Edad:</strong> {category.ageRange[0]} - {category.ageRange[1]} años</p>
                    <p><strong className="font-medium">Cupo Máximo:</strong> {category.maxCapacity}</p>
                    <p><strong className="font-medium">Alumnos Inscritos:</strong> {category.enrolledStudents}</p>
                    <p><strong className="font-medium">Profesor(es):</strong> {category.professors.join(', ')}</p>
                </div>
                 <div className="space-y-1 bg-muted p-3 rounded-md">
                    <p><strong className="font-medium">Días:</strong> {category.schedule.days.join(', ')}</p>
                    <p><strong className="font-medium">Turno:</strong> {category.schedule.time}</p>
                    <p><strong className="font-medium">Duración:</strong> {category.schedule.durationPerClass}</p>
                    <p><strong className="font-medium">Frecuencia:</strong> {category.schedule.frequency}</p>
                </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="font-semibold mb-2">Alumnos Inscritos</h3>
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
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cerrar</Button>
          </SheetClose>
          <Button onClick={handleEditClick}>Editar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
