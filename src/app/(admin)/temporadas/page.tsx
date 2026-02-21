'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { seasons } from '@/lib/data';
import type { Season } from '@/lib/types';
import { Calendar, MoreHorizontal, PlusCircle, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function TemporadasPage() {
  const [open, setOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  const handleEdit = (season: Season) => {
    setSelectedSeason(season);
    setOpen(true);
  };
  
  const handleCreate = () => {
    setSelectedSeason(null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Gestión de Temporadas</h1>
          <p className="text-muted-foreground">Crea y administra las temporadas de la academia.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
             <Button onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4" />Crear Temporada</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedSeason ? 'Editar' : 'Crear'} Temporada</DialogTitle>
              <DialogDescription>
                {selectedSeason ? 'Modifica los detalles de la temporada.' : 'Completa los detalles para una nueva temporada.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" defaultValue={selectedSeason?.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duración (días)</Label>
                <Input id="duration" type="number" defaultValue={selectedSeason?.duration} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Precio (S/)</Label>
                <Input id="price" type="number" defaultValue={selectedSeason?.price} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Fecha Inicio</Label>
                <Input id="startDate" type="date" defaultValue={selectedSeason?.startDate} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">Fecha Fin</Label>
                <Input id="endDate" type="date" defaultValue={selectedSeason?.endDate} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentDate" className="text-right">Fecha de Pago</Label>
                <Input id="paymentDate" type="date" defaultValue={selectedSeason?.paymentDate} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="benefits" className="text-right pt-2">Beneficios</Label>
                <Textarea id="benefits" defaultValue={selectedSeason?.benefits} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {seasons.map((season) => (
          <Card key={season.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline">{season.name}</CardTitle>
                <CardDescription>{season.duration} días de duración</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Ver</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(season)}>Editar</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">Deshabilitar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{season.studentCount} alumnos</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <span className="text-lg">S/ {season.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground font-normal">/ mensual</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Inicia: {format(new Date(season.startDate), 'dd/MM/yyyy')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    Horario: {season.schedule}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" onClick={() => handleEdit(season)}>Editar</Button>
                 <Button>Ver Detalles</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
