import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditCard, History, UserCheck, Eye, Edit } from 'lucide-react';
import { professors } from '@/lib/data';

type AlumnoViewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
};

export default function AlumnoViewSheet({ open, onOpenChange, student }: AlumnoViewSheetProps) {
  if (!student) return null;
  
  const professor = professors.find(p => p.id === student.professorId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-[90vw] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Ficha de Alumno</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.photoUrl} alt={student.name} />
              <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold font-headline">{student.name}</h2>
              <p className="text-muted-foreground">DNI: {student.dni}</p>
            </div>
             <Button variant="outline" size="icon" className="absolute top-4 right-16">
                <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h3 className="font-semibold text-base">Información Personal</h3>
              <p><strong className="font-medium">DNI:</strong> {student.dni}</p>
              <p><strong className="font-medium">Género:</strong> {student.gender}</p>
              <p><strong className="font-medium">Edad:</strong> {student.age} años</p>
              {student.phone && <p><strong className="font-medium">Teléfono:</strong> {student.phone}</p>}
              {student.guardian && (
                <div className="p-3 bg-muted rounded-md space-y-1">
                    <p className="font-semibold text-xs">RESPONSABLE</p>
                    <p><strong className="font-medium">Nombre:</strong> {student.guardian.name}</p>
                    <p><strong className="font-medium">DNI:</strong> {student.guardian.dni}</p>
                    <p><strong className="font-medium">Celular:</strong> {student.guardian.phone}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
               <h3 className="font-semibold text-base">Información Académica</h3>
                <p><strong className="font-medium">Deporte:</strong> {student.sport}</p>
                <p><strong className="font-medium">Temporada:</strong> {student.season}</p>
                <p><strong className="font-medium">Categoría:</strong> {student.category}</p>
                <p><strong className="font-medium">Profesor:</strong> {professor?.name}</p>
                <p><strong className="font-medium">Estado de Pago:</strong> <span className="font-bold text-primary">{student.paymentStatus}</span></p>
            </div>
          </div>
          
           <div className="space-y-3">
             <h3 className="font-semibold text-base">Estadísticas</h3>
             <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-muted rounded-md text-center">
                    <p className="text-2xl font-bold">{student.totalPayments}</p>
                    <p className="text-xs text-muted-foreground">Pagos Totales</p>
                 </div>
                 <div className="p-3 bg-muted rounded-md text-center">
                    <p className="text-2xl font-bold">{student.totalAttendance}</p>
                    <p className="text-xs text-muted-foreground">Asistencias Totales</p>
                 </div>
             </div>
           </div>

        </div>
        <SheetFooter className="flex flex-row flex-wrap justify-start sm:justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" className="h-auto py-2"><CreditCard className="mr-2 h-4 w-4"/> Control de Pagos</Button>
            <Button variant="outline" size="sm" className="h-auto py-2"><History className="mr-2 h-4 w-4"/> Historial</Button>
            <Button variant="outline" size="sm" className="h-auto py-2"><UserCheck className="mr-2 h-4 w-4"/> Asistencia</Button>
            <Button variant="outline" size="sm" className="h-auto py-2"><Eye className="mr-2 h-4 w-4"/> Visualizar Carnet</Button>
            <SheetClose asChild>
                <Button>Cerrar</Button>
            </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
