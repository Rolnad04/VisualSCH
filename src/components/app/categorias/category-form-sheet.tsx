import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { Category, Professor } from '@/lib/types';
import { MultiSelect } from '@/components/app/multi-select';

type CategoryFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  allProfessors: Professor[];
};

export default function CategoryFormSheet({ open, onOpenChange, category, allProfessors }: CategoryFormSheetProps) {
  const professorOptions = allProfessors.map(p => ({ value: p.id, label: p.name }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{category ? 'Editar' : 'Crear'} Categoría</SheetTitle>
          <SheetDescription>
            Completa los detalles de la categoría. Haz clic en guardar cuando termines.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" defaultValue={category?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sport">Deporte</Label>
            <Input id="sport" defaultValue={category?.sport || 'Fútbol'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="ageMin">Edad Mínima</Label>
                <Input id="ageMin" type="number" defaultValue={category?.ageRange[0]} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="ageMax">Edad Máxima</Label>
                <Input id="ageMax" type="number" defaultValue={category?.ageRange[1]} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Cupo Máximo</Label>
            <Input id="maxCapacity" type="number" defaultValue={category?.maxCapacity} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="price">Precio (S/)</Label>
            <Input id="price" type="number" defaultValue={category?.price} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input id="startDate" type="date" defaultValue={category?.startDate} />
          </div>
          <div className="space-y-2">
            <Label>Profesores</Label>
            <MultiSelect options={professorOptions} placeholder="Seleccionar profesores..."/>
          </div>
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium px-1">Horario</legend>
            <div className="grid gap-4 mt-2">
                 <div className="space-y-2">
                    <Label htmlFor="schedule-days">Días (ej: Lunes, Miércoles, Viernes)</Label>
                    <Input id="schedule-days" defaultValue={category?.schedule.days.join(', ')} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="schedule-time">Turno (ej: 10:00 a 12:00)</Label>
                    <Input id="schedule-time" defaultValue={category?.schedule.time} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="schedule-duration">Duración por clase</Label>
                    <Input id="schedule-duration" defaultValue={category?.schedule.durationPerClass} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="schedule-frequency">Frecuencia</Label>
                    <Input id="schedule-frequency" defaultValue={category?.schedule.frequency} />
                </div>
            </div>
          </fieldset>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button type="submit">Guardar Categoría</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
