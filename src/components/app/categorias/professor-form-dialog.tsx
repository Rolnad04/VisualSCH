import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Professor } from '@/lib/types';

type ProfessorFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professor: Professor | null;
};

export default function ProfessorFormDialog({ open, onOpenChange, professor }: ProfessorFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{professor ? 'Editar' : 'Nuevo'} Profesor</DialogTitle>
          <DialogDescription>
            {professor ? 'Actualiza los datos del profesor.' : 'Añade un nuevo profesor al sistema.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prof-name" className="text-right">Nombres y Apellidos</Label>
            <Input id="prof-name" defaultValue={professor?.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prof-sport" className="text-right">Deporte</Label>
            <Input id="prof-sport" defaultValue={professor?.sport || 'Fútbol'} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prof-phone" className="text-right">Teléfono</Label>
            <Input id="prof-phone" defaultValue={professor?.phone} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prof-email" className="text-right">Email</Label>
            <Input id="prof-email" type="email" defaultValue={professor?.email} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
