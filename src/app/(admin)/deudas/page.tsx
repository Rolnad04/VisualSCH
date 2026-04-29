'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Check, RefreshCw, Clock, AlertCircle, AlertTriangle, Search, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { students } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const debtSchema = z.object({
  studentSearch: z.string().optional(),
  studentId: z.string().min(1, "Debe seleccionar un alumno"),
  monto: z.string().min(1, "Ingrese el monto").refine(v => !isNaN(Number(v)) && Number(v) > 0, "Debe ser un número mayor a 0"),
  descripcion: z.string().min(3, "Ingrese una descripción del cobro"),
  payerNombre: z.string().min(3, "Ingrese el nombre completo del pagador"),
  payerDni: z.string().length(8, "El DNI debe tener exactamente 8 dígitos").regex(/^\d{8}$/, "Solo se permiten números"),
  metodoPago: z.enum(['Yape', 'Efectivo', 'Transferencia']),
  observaciones: z.string().optional(),
});

type DebtValues = z.infer<typeof debtSchema>;

export default function DeudasPage() {
  const { toast } = useToast();
  const [photoEvidence, setPhotoEvidence] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [obsTimestamp, setObsTimestamp] = useState<string | null>(null);

  const form = useForm<DebtValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      studentSearch: '',
      studentId: '',
      monto: '',
      descripcion: '',
      payerNombre: '',
      payerDni: '',
      metodoPago: 'Efectivo',
      observaciones: '',
    },
  });

  const watchPaymentMethod = form.watch('metodoPago');
  const watchObservaciones = form.watch('observaciones');

  // Filter students with pending debts or all
  const debtStudents = students.filter(s => s.paymentStatus === 'Deuda pendiente');
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.dni.includes(searchQuery)
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleEvidenceUpload = () => {
    setPhotoEvidence("https://picsum.photos/seed/debt-voucher/300/500");
  };

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleObsChange = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || !value.trim()) {
      setObsTimestamp(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'p. m.' : 'a. m.';
      const h12 = hours % 12 || 12;
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      setObsTimestamp(`${h12}:${minutes} ${period} · ${day}/${month}/${year}`);
    }, 400);
  }, []);

  const onSubmit = (data: DebtValues) => {
    if ((data.metodoPago === 'Yape' || data.metodoPago === 'Transferencia') && !photoEvidence) {
      toast({
        title: "Foto de evidencia requerida",
        description: "Para pagos por Yape o Transferencia debe subir la foto del voucher.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pago registrado exitosamente",
      description: `Se ha registrado el pago de mensualidad de S/ ${data.monto} para su confirmación.`,
    });
    form.reset();
    setPhotoEvidence(null);
    setSelectedStudentId(null);
    setSearchQuery('');
    setObsTimestamp(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
          Cobro de Mensualidad
        </h1>
        <p className="text-muted-foreground">Registra y procesa el pago de mensualidades (regulares o atrasadas).</p>
      </div>

      {/* Debtors summary */}
      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-base text-red-700 dark:text-red-400">Alumnos con deuda pendiente</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {debtStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay alumnos con deuda pendiente.</p>
            ) : (
              debtStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedStudentId(s.id);
                    form.setValue('studentId', s.id);
                    if (s.debtAmount !== undefined) {
                      form.setValue('monto', String(s.debtAmount));
                    }
                    if (s.monthsOwed !== undefined && s.monthsOwed > 0) {
                      form.setValue('descripcion', `Pago de mensualidad atrasada (${s.monthsOwed} mes/es)`);
                    } else {
                      form.setValue('descripcion', 'Pago de mensualidad regular');
                    }
                    if (s.age >= 18) {
                      form.setValue('payerNombre', s.name);
                      form.setValue('payerDni', s.dni);
                    } else {
                      form.setValue('payerNombre', '');
                      form.setValue('payerDni', '');
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-50 transition-colors text-sm"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={s.photoUrl} />
                    <AvatarFallback>{s.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{s.name}</span>
                  <Badge variant="destructive" className="text-[10px] px-1 py-0">{s.paymentStatus}</Badge>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Student selection */}
            <Card className="shadow-lg border-primary/10 md:col-span-2">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Seleccionar Alumno</CardTitle>
                <CardDescription>Busque y seleccione el alumno para registrar el pago de mensualidad.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o DNI..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery && (
                  <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">Sin resultados</p>
                    ) : (
                      filteredStudents.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          className={cn(
                            "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left",
                            selectedStudentId === s.id && "bg-primary/5"
                          )}
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            form.setValue('studentId', s.id);
                            if (s.debtAmount !== undefined) {
                              form.setValue('monto', String(s.debtAmount));
                            }
                            if (s.monthsOwed !== undefined && s.monthsOwed > 1) {
                              form.setValue('descripcion', `Pago de mensualidad atrasada (${s.monthsOwed} mes/es)`);
                            } else {
                              form.setValue('descripcion', 'Pago de mensualidad regular');
                            }
                            if (s.age >= 18) {
                              form.setValue('payerNombre', s.name);
                              form.setValue('payerDni', s.dni);
                            } else {
                              form.setValue('payerNombre', '');
                              form.setValue('payerDni', '');
                            }
                            setSearchQuery('');
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={s.photoUrl} />
                            <AvatarFallback>{s.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">DNI: {s.dni} · {s.category}</p>
                          </div>
                          <Badge variant={s.paymentStatus === 'Deuda pendiente' ? 'destructive' : 'secondary'} className="text-[10px]">
                            {s.paymentStatus}
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                )}
                {selectedStudent && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedStudent.photoUrl} />
                      <AvatarFallback>{selectedStudent.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{selectedStudent.name}</p>
                      <p className="text-sm text-muted-foreground">DNI: {selectedStudent.dni} · {selectedStudent.category} · {selectedStudent.season}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant={selectedStudent.paymentStatus === 'Deuda pendiente' ? 'destructive' : 'secondary'}>
                        {selectedStudent.paymentStatus}
                      </Badge>
                      {selectedStudent.paymentStatus === 'Deuda pendiente' && (
                        <Badge variant="outline" className="text-xs animate-in fade-in duration-300">
                          {selectedStudent.monthsOwed && selectedStudent.monthsOwed > 0
                            ? `Mensualidades adeudadas: ${selectedStudent.monthsOwed}`
                            : 'Deuda por accesorios'}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="studentId"
                  render={() => <FormMessage />}
                />
              </CardContent>
            </Card>

            {/* Debt details */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Detalle del Cobro</CardTitle>
                <CardDescription>Información del monto y tipo de mensualidad.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <FormField
                  control={form.control}
                  name="monto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto (S/)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          readOnly
                          className="bg-muted/50 opacity-75 cursor-not-allowed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del cobro</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Mensualidad Marzo 2026"
                          readOnly
                          className="bg-muted/50 opacity-75 cursor-not-allowed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payer info separator */}
                <div className="border-t pt-4 mt-2">
                  {selectedStudent && selectedStudent.age < 18 && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4 animate-in fade-in duration-300">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-700">
                        Alumno menor de edad. Ingrese los datos del apoderado o persona responsable del pago.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="payerNombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres y Apellidos del Pagador</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Mario Perez García" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payerDni"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DNI del Pagador</FormLabel>
                          <FormControl>
                            <Input placeholder="12345678" maxLength={8} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="metodoPago"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pago</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione método" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yape">Yape</SelectItem>
                          <SelectItem value="Efectivo">Efectivo</SelectItem>
                          <SelectItem value="Transferencia">Transferencia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Payment evidence + observations */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Evidencia y Observaciones</CardTitle>
                <CardDescription>Foto del voucher (obligatoria para Yape/Transferencia).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {(watchPaymentMethod === 'Yape' || watchPaymentMethod === 'Transferencia') && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <label className="text-sm font-medium leading-none flex items-center gap-1">
                      Foto de Evidencia
                      <span className="text-red-500 text-xs ml-1">* (obligatoria)</span>
                    </label>
                    <div
                      className={cn(
                        "relative w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-muted/20 cursor-pointer group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 overflow-hidden",
                        photoEvidence ? "h-48" : "h-36"
                      )}
                      onClick={!photoEvidence ? handleEvidenceUpload : undefined}
                    >
                      {photoEvidence ? (
                        <>
                          <img src={photoEvidence} alt="Foto de evidencia" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Check className="h-8 w-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                          <span className="text-sm text-muted-foreground mt-2 group-hover:text-primary/80 transition-colors">
                            Toca para subir el voucher
                          </span>
                        </>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full"
                      onClick={handleEvidenceUpload}
                    >
                      {photoEvidence ? (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Cambiar foto de voucher
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4" />
                          Subir foto de voucher
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas adicionales para el administrador..."
                          className="min-h-[80px]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleObsChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      {obsTimestamp && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>Modificado: {obsTimestamp}</span>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto px-12 bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition-all font-bold"
            >
              Enviar solicitud de confirmacion
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
