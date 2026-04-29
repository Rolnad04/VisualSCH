'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category, Professor } from '@/lib/types';
import { Users, Clock, Calendar, Sun, CheckCircle2, GraduationCap, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type CategoryCardProps = {
  category: Category;
  professors: Professor[];
  onView: (category: Category) => void;
  onUpdate?: (updated: Category) => void;
  isActiveNow?: boolean;
  userRole?: string | null;
};

export default function CategoryCard({ category, professors, onView, onUpdate, isActiveNow, userRole }: CategoryCardProps) {
  const { toast } = useToast();
  const categoryProfessors = professors.filter(p => category.professors.includes(p.name));

  const isAdmin = userRole === 'Administrador';

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    maxCapacity: category.maxCapacity,
    price: category.price,
    days: category.schedule.days.join(', '),
    time: category.schedule.time,
    durationPerClass: category.schedule.durationPerClass,
    frequency: category.schedule.frequency,
  });

  const handleOpenEdit = () => {
    setEditForm({
      maxCapacity: category.maxCapacity,
      price: category.price,
      days: category.schedule.days.join(', '),
      time: category.schedule.time,
      durationPerClass: category.schedule.durationPerClass,
      frequency: category.schedule.frequency,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    const updated: Category = {
      ...category,
      maxCapacity: editForm.maxCapacity,
      price: editForm.price,
      schedule: {
        ...category.schedule,
        days: editForm.days.split(',').map(d => d.trim()).filter(Boolean),
        time: editForm.time,
        durationPerClass: editForm.durationPerClass,
        frequency: editForm.frequency,
      },
    };
    onUpdate?.(updated);
    setEditOpen(false);
    toast({
      title: 'Categoría actualizada',
      description: `Se actualizó "${category.name}" correctamente.`,
    });
  };

  return (
    <>
      <Card className={isActiveNow ? 'border-green-500/50 shadow-green-500/10 shadow-md' : ''}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="font-headline">{category.name}</CardTitle>
              {isActiveNow && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-[10px] gap-1 px-1.5 py-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  En curso
                </Badge>
              )}
            </div>
            <CardDescription>{category.schedule.frequency}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-center text-center p-4 rounded-lg bg-primary/5">
              <p className="text-3xl font-bold text-primary">S/ {category.price.toFixed(2)}</p>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
              {/* Professors */}
              <div className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 mt-0.5 shrink-0"/>
                <span>
                  {categoryProfessors.length > 0
                    ? categoryProfessors.map(p => p.name).join(', ')
                    : category.professors.join(', ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0"/>
                  <span>{category.schedule.time}</span>
              </div>
              <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0"/>
                  <span>{category.enrolledStudents} / {category.maxCapacity} alumnos</span>
              </div>
              <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0"/>
                  <span>Inicia: {format(new Date(category.startDate), 'dd/MM/yyyy')}</span>
              </div>
               <div className="flex items-start gap-2">
                  <Sun className="h-4 w-4 shrink-0 mt-0.5"/>
                  <span>{category.schedule.days.join(' · ')}</span>
              </div>
          </div>
        </CardContent>
         <CardFooter className="flex justify-end gap-2">
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={handleOpenEdit} className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
              )}
              <Button onClick={() => onView(category)}>Ver Detalles</Button>
        </CardFooter>
      </Card>

      {/* Edit Dialog — Admin only */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Modifica los datos de &quot;{category.name}&quot;</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-capacity-${category.id}`}>Cupos máximos</Label>
                <Input
                  id={`edit-capacity-${category.id}`}
                  type="number"
                  min={1}
                  value={editForm.maxCapacity}
                  onChange={e => setEditForm(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-price-${category.id}`}>Precio (S/)</Label>
                <Input
                  id={`edit-price-${category.id}`}
                  type="number"
                  min={0}
                  step={0.01}
                  value={editForm.price}
                  onChange={e => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-days-${category.id}`}>Días activos</Label>
              <Input
                id={`edit-days-${category.id}`}
                type="text"
                placeholder="Ej: Lunes, Miércoles, Viernes"
                value={editForm.days}
                onChange={e => setEditForm(prev => ({ ...prev, days: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-time-${category.id}`}>Horario</Label>
                <Input
                  id={`edit-time-${category.id}`}
                  type="text"
                  placeholder="Ej: 10:00 a 12:00"
                  value={editForm.time}
                  onChange={e => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-duration-${category.id}`}>Duración por clase</Label>
                <Input
                  id={`edit-duration-${category.id}`}
                  type="text"
                  placeholder="Ej: 2 horas"
                  value={editForm.durationPerClass}
                  onChange={e => setEditForm(prev => ({ ...prev, durationPerClass: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-freq-${category.id}`}>Frecuencia</Label>
              <Input
                id={`edit-freq-${category.id}`}
                type="text"
                placeholder="Ej: 3 veces por semana"
                value={editForm.frequency}
                onChange={e => setEditForm(prev => ({ ...prev, frequency: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
