'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { packages } from '@/lib/data';
import type { Package } from '@/lib/types';
import { Package as PackageIcon, PlusCircle } from 'lucide-react';

export default function PaquetesPage() {
    const [open, setOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

    const handleEdit = (pkg: Package) => {
        setSelectedPackage(pkg);
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedPackage(null);
        setOpen(true);
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Gestión de Paquetes</h1>
          <p className="text-muted-foreground">Crea y edita los paquetes de servicios de la academia.</p>
        </div>
         <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4" />Crear Paquete</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedPackage ? 'Editar' : 'Crear'} Paquete</DialogTitle>
              <DialogDescription>
                {selectedPackage ? 'Modifica los detalles del paquete.' : 'Completa los detalles para un nuevo paquete.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" defaultValue={selectedPackage?.name} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Precio (S/)</Label>
                <Input id="price" type="number" defaultValue={selectedPackage?.price} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Descripción</Label>
                <Textarea id="description" defaultValue={selectedPackage?.description} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <PackageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline">{pkg.name}</CardTitle>
                  <p className="font-bold text-lg text-primary">S/ {pkg.price.toFixed(2)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{pkg.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0 text-right">
                <Button variant="outline" onClick={() => handleEdit(pkg)}>Editar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
