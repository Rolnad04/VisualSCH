'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SolicitudesClient from '@/components/app/solicitudes/solicitudes-client';
import { requests } from '@/lib/data';

function SolicitudesPageContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  const defaultValue = statusParam || 'all';

  return (
    <Tabs defaultValue={defaultValue}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Todo</TabsTrigger>
          <TabsTrigger value="Pendiente" className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            Pendiente
          </TabsTrigger>
          <TabsTrigger value="Confirmado" className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Confirmado
          </TabsTrigger>
          <TabsTrigger value="Observado" className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-orange-500" />
            Observado
          </TabsTrigger>
          <TabsTrigger value="Rechazado" className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            Rechazado
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Confirmación</CardTitle>
            <CardDescription>
              Gestiona y valida los pagos y solicitudes registrados por las promotoras.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SolicitudesClient initialRequests={requests} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Pendiente">
         <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>
              Solicitudes esperando validación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SolicitudesClient initialRequests={requests} initialStatus="Pendiente" />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Confirmado">
         <Card>
          <CardHeader>
            <CardTitle>Solicitudes Confirmadas</CardTitle>
            <CardDescription>
              Solicitudes que han sido aprobadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SolicitudesClient initialRequests={requests} initialStatus="Confirmado" />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="Observado">
         <Card>
          <CardHeader>
            <CardTitle>Solicitudes Observadas</CardTitle>
            <CardDescription>
              Solicitudes que requieren corrección o información adicional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SolicitudesClient initialRequests={requests} initialStatus="Observado" />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="Rechazado">
         <Card>
          <CardHeader>
            <CardTitle>Solicitudes Rechazadas</CardTitle>
            <CardDescription>
              Solicitudes que han sido denegadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SolicitudesClient initialRequests={requests} initialStatus="Rechazado" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function SolicitudesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SolicitudesPageContent />
    </Suspense>
  );
}
