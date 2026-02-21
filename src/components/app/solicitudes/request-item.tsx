'use client';
import Image from 'next/image';
import {
  ChevronDown,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Printer,
  FileText,
  MessageSquare,
  Paperclip
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ConfirmationRequest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';

type RequestItemProps = {
  request: ConfirmationRequest;
  isLast: boolean;
};

const statusConfig = {
  Pendiente: { color: 'bg-yellow-500', icon: Clock },
  Confirmado: { color: 'bg-green-500', icon: CheckCircle },
  Rechazado: { color: 'bg-red-500', icon: XCircle },
  Observado: { color: 'bg-orange-500', icon: AlertTriangle },
};

export default function RequestItem({ request, isLast }: RequestItemProps) {
  const { color, icon: Icon } = statusConfig[request.status];

  return (
    <Collapsible>
      <div className={cn('flex items-center px-4 py-3', !isLast && 'border-b')}>
        <div className="grid grid-cols-12 gap-4 flex-1 items-center">
            <div className="col-span-3 lg:col-span-2 flex items-center gap-2">
                <span className={cn('h-2.5 w-2.5 rounded-full', color)} />
                <span className="font-medium">{format(new Date(request.timestamp), 'HH:mm')}</span>
            </div>
            <div className="col-span-5 lg:col-span-4 font-medium truncate">{request.motive}</div>
            <div className="col-span-4 lg:col-span-3 text-muted-foreground truncate">{request.promoterName}</div>
            <div className="hidden lg:flex col-span-2 items-center gap-2">
                <Badge variant={request.status === 'Rechazado' ? 'destructive' : 'secondary'}>
                    <Icon className="mr-1 h-3 w-3" />
                    {request.status}
                </Badge>
            </div>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="bg-muted/50 p-4 border-t">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Columna de Información del Alumno */}
          <div className="space-y-4">
            <h4 className="font-semibold">Información del Alumno</h4>
            <div className="text-sm space-y-2">
              <p><strong className="font-medium">Nombres y Apellidos:</strong> {request.student.name}</p>
              {request.student.isMinor ? (
                <>
                  <p><strong className="font-medium">Responsable:</strong> {request.student.guardianName}</p>
                  <p><strong className="font-medium">Teléfono (Resp.):</strong> {request.student.guardianPhone}</p>
                </>
              ) : (
                <p><strong className="font-medium">Teléfono (Alum.):</strong> {request.student.studentPhone}</p>
              )}
              <p><strong className="font-medium">Deporte:</strong> {request.student.sport}</p>
              <p><strong className="font-medium">Categoría:</strong> {request.student.category}</p>
              <p><strong className="font-medium">Horario:</strong> {request.student.schedule}</p>
              <p><strong className="font-medium">Profesor:</strong> {request.student.professor}</p>
            </div>
          </div>

          {/* Columna de Pago y Evidencia */}
          <div className="space-y-4">
            <h4 className="font-semibold">Información del Pago</h4>
            <div className="text-sm space-y-2">
              <p><strong className="font-medium">Realizado por:</strong> {request.payment.payerName}</p>
              <p><strong className="font-medium">Monto:</strong> S/ {request.payment.amount.toFixed(2)}</p>
              <p><strong className="font-medium">Método:</strong> {request.payment.method}</p>
            </div>
             {request.promoterNotes && (
              <div className="pt-2">
                <h5 className="font-semibold text-xs mb-1">Notas de la promotora:</h5>
                <p className="text-sm text-muted-foreground italic border-l-2 pl-2">"{request.promoterNotes}"</p>
              </div>
            )}
          </div>
          
          {/* Columna de Evidencias */}
          <div className="space-y-6">
            {request.payment.evidencePhotoUrl && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2"><Paperclip size={16}/> Evidencia (Promotora)</h4>
                <Image src={request.payment.evidencePhotoUrl} alt="Evidencia de pago" width={300} height={500} className="rounded-lg border shadow-sm" data-ai-hint="phone screen" />
                <p className="text-xs text-muted-foreground">Subido: {format(new Date(request.payment.evidenceTimestamp!), "dd/MM/yyyy HH:mm 'hrs'")}</p>
              </div>
            )}
             
            {request.status === 'Observado' && request.observation && (
                 <div className="space-y-2">
                    <h4 className="font-semibold text-amber-600 flex items-center gap-2"><AlertTriangle size={16}/> Observación del Admin</h4>
                     <p className="text-xs text-muted-foreground">
                        Observado el: {format(new Date(request.observation.timestamp), "dd/MM/yyyy HH:mm 'hrs'")}
                    </p>
                    <Textarea defaultValue={request.observation.notes} placeholder="Escriba aquí el motivo de la observación..."/>
                    <Button variant="outline" size="sm" className="mt-2">Subir nueva evidencia</Button>
                </div>
            )}

            {request.status === 'Confirmado' && request.observation?.adminEvidencePhotoUrl && (
                 <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><Paperclip size={16}/> Evidencia (Admin)</h4>
                    <Image src={request.observation.adminEvidencePhotoUrl} alt="Evidencia de pago" width={300} height={500} className="rounded-lg border shadow-sm" data-ai-hint="document receipt" />
                    <p className="text-xs text-muted-foreground">Subido: {format(new Date(request.observation.adminEvidenceTimestamp!), "dd/MM/yyyy HH:mm 'hrs'")}</p>
                 </div>
            )}

            {request.status === 'Confirmado' && (
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600 flex items-center gap-2"><FileText size={16}/> Boleta Electrónica</h4>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <p className="text-center text-sm text-muted-foreground">Vista previa de la boleta</p>
                    <Image src="https://picsum.photos/seed/boleta/400/600" alt="Boleta electrónica" width={400} height={600} className="rounded-md mt-2" data-ai-hint="invoice document" />
                </div>
                 <p className="text-xs text-muted-foreground">
                    Confirmado el: {format(new Date(request.confirmationTimestamp!), "dd/MM/yyyy HH:mm 'hrs'")}
                </p>
                <Button size="sm"><Printer className="mr-2 h-4 w-4"/> Imprimir</Button>
              </div>
            )}

            {request.status === 'Confirmado' && request.observation?.notes && (
                 <div className="space-y-2">
                    <h4 className="font-semibold text-amber-600 flex items-center gap-2"><AlertTriangle size={16}/> Observación Atendida</h4>
                     <p className="text-xs text-muted-foreground">
                        Observado el: {format(new Date(request.observation.timestamp), "dd/MM/yyyy HH:mm 'hrs'")}
                    </p>
                    <p className="text-sm text-muted-foreground border-l-2 pl-2 p-2 bg-background rounded-md">{request.observation.notes}</p>
                </div>
            )}

          </div>
        </div>
        
        {/* Acciones */}
        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          {request.status === 'Pendiente' && (
            <>
              <Button variant="outline">Observar</Button>
              <Button variant="destructive">Rechazar</Button>
              <Button className="bg-green-600 hover:bg-green-700">Confirmar</Button>
            </>
          )}
           {request.status === 'Observado' && (
            <>
              <Button variant="destructive">Rechazar</Button>
              <Button className="bg-green-600 hover:bg-green-700">Confirmar</Button>
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
