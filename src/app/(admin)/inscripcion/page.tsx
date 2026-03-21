'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInYears } from 'date-fns';
import { Calendar as CalendarIcon, Upload, Check, Info, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const enrollmentSchema = z.object({
  dni: z.string().length(8, "El DNI debe tener exactamente 8 dígitos").regex(/^\d+$/, "Solo se permiten números"),
  nombres: z.string().min(2, "Mínimo 2 letras").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  apellidos: z.string().min(2, "Mínimo 2 letras").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  fechaNacimiento: z.date({
    required_error: "La fecha de nacimiento es obligatoria",
  }),
  sexo: z.enum(['Masculino', 'Femenino']),
  responsable: z.string().optional(),
  dniResponsable: z.string().max(8, "Máximo 8 dígitos").regex(/^\d*$/, "Solo se permiten números").optional(),
  deporte: z.string().default("Fútbol"),
  celular: z.string().regex(/^9\d{8}$/, "Debe comenzar con 9 y tener 9 dígitos").optional(),
  celularResponsable: z.string().regex(/^9\d{8}$/, "Debe comenzar con 9 y tener 9 dígitos").optional(),
  temporada: z.string().default("Anual"),
  horario: z.string().min(1, "Debe seleccionar un horario"),
  profesor: z.string(),
  metodoPago: z.enum(['Yape', 'Efectivo', 'Transferencia']),
  observaciones: z.string().optional(),
}).refine((data) => {
  const age = differenceInYears(new Date(), data.fechaNacimiento);
  if (age < 18) {
    return !!data.responsable && !!data.dniResponsable && !!data.celularResponsable;
  }
  return !!data.celular;
}, {
  message: "Faltan campos obligatorios según la edad del alumno",
  path: ["fechaNacimiento"]
});

type EnrollmentValues = z.infer<typeof enrollmentSchema>;

export default function InscripcionPage() {
  const { toast } = useToast();
  const [age, setAge] = useState<number | null>(null);
  const [photoEvidence, setPhotoEvidence] = useState<string | null>(null);
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);

  const form = useForm<EnrollmentValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      dni: "",
      nombres: "",
      apellidos: "",
      sexo: "Masculino",
      deporte: "Fútbol",
      temporada: "Anual",
      metodoPago: "Efectivo",
      profesor: "",
      horario: "",
      observaciones: "",
    },
  });

  const watchBirthDate = form.watch("fechaNacimiento");
  const watchHorario = form.watch("horario");
  const watchPaymentMethod = form.watch("metodoPago");

  useEffect(() => {
    if (watchBirthDate) {
      const calculatedAge = differenceInYears(new Date(), watchBirthDate);
      setAge(calculatedAge);
    }
  }, [watchBirthDate]);

  useEffect(() => {
    const professorsMap: Record<string, string> = {
      "10:00 - 12:00": "Alberto Domínguez",
      "14:00 - 16:00": "Carlos Orellano",
    };
    if (watchHorario) {
      form.setValue("profesor", professorsMap[watchHorario] || "");
    }
  }, [watchHorario, form]);

  const onSubmit = (data: EnrollmentValues) => {
    console.log("Submit data:", data);
    toast({
      title: "Solicitud enviada",
      description: "La solicitud de inscripción ha sido enviada correctamente al administrador.",
    });
    form.reset();
    setPhotoEvidence(null);
    setStudentPhoto(null);
    setAge(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Nueva Inscripción</h1>
        <p className="text-muted-foreground">Complete el formulario para registrar a un nuevo alumno.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* --- Sección: Datos del Alumno --- */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Datos Personales</CardTitle>
                <CardDescription>Información básica del estudiante.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese 8 dígitos" {...field} maxLength={8} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Solo letras" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apellidos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Solo letras" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Nacimiento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Seleccione fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sexo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Femenino">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* --- Sección: Responsable / Contacto --- */}
            <Card className="shadow-lg border-primary/10 h-fit">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Responsable y Contacto</CardTitle>
                <CardDescription>
                  {age !== null && age < 18
                    ? "El alumno es menor de edad, se requiere datos del tutor."
                    : "Datos de contacto directo."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {age !== null && age < 18 ? (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <FormField
                      control={form.control}
                      name="responsable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Responsable</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dniResponsable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DNI Responsable</FormLabel>
                            <FormControl>
                              <Input placeholder="8 dígitos" {...field} maxLength={8} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="celularResponsable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Celular Responsable</FormLabel>
                            <FormControl>
                              <Input placeholder="Empieza con 9" {...field} maxLength={9} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : age !== null && (
                  <FormField
                    control={form.control}
                    name="celular"
                    render={({ field }) => (
                      <FormItem className="animate-in slide-in-from-top-2 duration-300">
                        <FormLabel>Número de Celular</FormLabel>
                        <FormControl>
                          <Input placeholder="Empieza con 9" {...field} maxLength={9} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {age === null && (
                  <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground text-center italic">
                      Seleccione la fecha de nacimiento para activar estos campos.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- Sección: Academia y Horario --- */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Información de la Academia</CardTitle>
                <CardDescription>Deporte, temporada y horarios.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deporte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deporte</FormLabel>
                        <Select disabled defaultValue="Fútbol">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Fútbol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fútbol">Fútbol</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temporada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temporada</FormLabel>
                        <Select disabled defaultValue="Anual">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Anual" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Anual">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="horario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horario</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione horario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Turno Mañana</div>
                            <SelectItem value="10:00 - 12:00">10:00 - 12:00</SelectItem>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t">Turno Tarde</div>
                            <SelectItem value="14:00 - 16:00">14:00 - 16:00</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profesor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profesor</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted opacity-80" placeholder="Auto-completado" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* --- Sección: Pago y Evidencia --- */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Pago y Observaciones</CardTitle>
                <CardDescription>Detalles del pago y notas adicionales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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

                {(watchPaymentMethod === "Yape" || watchPaymentMethod === "Transferencia") && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <label className="text-sm font-medium leading-none">Foto Evidencia (Voucher)</label>
                    <div className="flex items-center gap-4 py-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setPhotoEvidence("https://picsum.photos/seed/voucher/300/500")}
                      >
                        <Upload className="h-4 w-4" />
                        Subir evidencia
                      </Button>
                      {photoEvidence && <Check className="text-green-500 h-5 w-5" />}
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Cualquier observación para el administrador..." className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">Foto del Alumno</CardTitle>
              <CardDescription>Esta foto será utilizada para su carnet y ficha técnica.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-8 pt-6">
              <div className="w-32 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-muted/20 relative overflow-hidden group">
                {studentPhoto ? (
                  <img src={studentPhoto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Users className="h-8 w-8 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground mt-2">Sin foto</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => setStudentPhoto("https://picsum.photos/seed/student/200/250")}>
                  <Upload className="text-white h-6 w-6" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-sm">
                  <Info className="h-5 w-5 shrink-0" />
                  <p>Suba una foto clara del rostro del alumno sobre un fondo uniforme para mejores resultados en el carnet.</p>
                </div>
                <Button type="button" variant="secondary" onClick={() => setStudentPhoto("https://picsum.photos/seed/student/200/250")}>
                  Seleccionar Foto de Perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="w-full md:w-auto px-12 bg-gradient-to-r from-primary to-blue-700 hover:opacity-90 transition-all font-bold">
              Enviar solicitud de inscripción
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
