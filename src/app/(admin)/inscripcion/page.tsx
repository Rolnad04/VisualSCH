'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Upload, Check, Info, Users, RefreshCw, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Category definition
type CategoryDef = {
  name: string;
  label: string;
  minAge: number;
  maxAge: number;
};

const ACADEMY_CATEGORIES: CategoryDef[] = [
  { name: 'Sub 6', label: 'Sub 6 (4-6 años)', minAge: 4, maxAge: 6 },
  { name: 'Sub 8', label: 'Sub 8 (7-8 años)', minAge: 7, maxAge: 8 },
  { name: 'Sub 10', label: 'Sub 10 (9-10 años)', minAge: 9, maxAge: 10 },
  { name: 'Sub 12', label: 'Sub 12 (11-12 años)', minAge: 11, maxAge: 12 },
  { name: 'Sub 13', label: 'Sub 13 (13 años)', minAge: 13, maxAge: 13 },
  { name: 'Sub 15', label: 'Sub 15 (14-15 años)', minAge: 14, maxAge: 15 },
  { name: 'Sub 17', label: 'Sub 17 (16-17 años)', minAge: 16, maxAge: 99 },
];

const DISTRITOS = [
  'Huaraz', 'Independencia', 'Cochabamba', 'Colcabamba',
  'Huanchay', 'Jangas', 'La Libertad', 'Olleros',
  'Pampas', 'Pariacoto', 'Pira', 'Taricá',
];

const getAutoCategory = (age: number): string => {
  const cat = ACADEMY_CATEGORIES.find(c => age >= c.minAge && age <= c.maxAge);
  return cat ? cat.name : '';
};

const isAgeOutOfCategory = (age: number | null, categoryName: string): boolean => {
  if (age === null || !categoryName) return false;
  const cat = ACADEMY_CATEGORIES.find(c => c.name === categoryName);
  if (!cat) return false;
  return age < cat.minAge || age > cat.maxAge;
};

const enrollmentSchema = z.object({
  dni: z.string().length(8, "El DNI debe tener exactamente 8 dígitos").regex(/^\d+$/, "Solo se permiten números"),
  nombres: z.string().min(2, "Mínimo 2 letras").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  apellidos: z.string().min(2, "Mínimo 2 letras").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  fechaNacimiento: z.date({
    required_error: "La fecha de nacimiento es obligatoria",
  }),
  sexo: z.enum(['Masculino', 'Femenino']),
  responsable: z.string().optional(),
  apellidoResponsable: z.string().optional(),
  dniResponsable: z.string().max(8, "Máximo 8 dígitos").regex(/^\d*$/, "Solo se permiten números").optional(),
  deporte: z.string().default("Fútbol"),
  celular: z.string().regex(/^9\d{8}$/, "Debe comenzar con 9 y tener 9 dígitos").optional(),
  celularResponsable: z.string().regex(/^9\d{8}$/, "Debe comenzar con 9 y tener 9 dígitos").optional(),
  temporada: z.string().default("Anual"),
  horario: z.string().min(1, "Debe seleccionar un horario"),
  profesor: z.string(),
  distrito: z.string().min(1, "Debe seleccionar un distrito"),
  categoria: z.string().min(1, "Debe seleccionar una categoría"),
  metodoPago: z.enum(['Yape', 'Efectivo', 'Transferencia']),
  observaciones: z.string().optional(),
}).refine((data) => {
  const age = differenceInYears(new Date(), data.fechaNacimiento);
  if (age < 18) {
    return !!data.responsable && !!data.apellidoResponsable && !!data.dniResponsable && !!data.celularResponsable;
  }
  return !!data.celular;
}, {
  message: "Faltan campos obligatorios según la edad del alumno",
  path: ["fechaNacimiento"]
});

type EnrollmentValues = z.infer<typeof enrollmentSchema>;

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => currentYear - i);

export default function InscripcionPage() {
  const { toast } = useToast();
  const [age, setAge] = useState<number | null>(null);
  const [photoEvidence, setPhotoEvidence] = useState<string | null>(null);
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [obsTimestamp, setObsTimestamp] = useState<string | null>(null);
  const [categoryManuallyChanged, setCategoryManuallyChanged] = useState(false);
  const fileEvidenceRef = useRef<HTMLInputElement>(null);

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
      distrito: "",
      categoria: "",
    },
  });

  const watchBirthDate = form.watch("fechaNacimiento");
  const watchHorario = form.watch("horario");
  const watchPaymentMethod = form.watch("metodoPago");
  const watchCategoria = form.watch("categoria");
  const watchObservaciones = form.watch("observaciones");

  // Watchers for conditional responsable section
  const watchDni = form.watch("dni");
  const watchNombres = form.watch("nombres");
  const watchApellidos = form.watch("apellidos");
  const watchSexo = form.watch("sexo");

  const isPersonalDataComplete = !!(
    watchDni && watchDni.length === 8 &&
    watchNombres && watchNombres.length >= 2 &&
    watchApellidos && watchApellidos.length >= 2 &&
    watchBirthDate &&
    watchSexo
  );

  const ageOutOfCategory = age !== null && isAgeOutOfCategory(age, watchCategoria);
  const obsRequired = ageOutOfCategory && !watchObservaciones?.trim();

  useEffect(() => {
    if (watchBirthDate) {
      const calculatedAge = differenceInYears(new Date(), watchBirthDate);
      setAge(calculatedAge);
      if (!categoryManuallyChanged) {
        const autocat = getAutoCategory(calculatedAge);
        if (autocat) form.setValue("categoria", autocat);
      }
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

  const handleEvidenceUpload = () => {
    // Simulate file picker — set a mock image
    setPhotoEvidence("https://picsum.photos/seed/voucher/300/500");
  };

  const handleObsBlur = () => {
    if (watchObservaciones && watchObservaciones.trim()) {
      const now = new Date();
      setObsTimestamp(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + now.toLocaleDateString('es-PE'));
    }
  };

  const onSubmit = (data: EnrollmentValues) => {
    // Extra validation: evidence photo required for Yape/Transferencia
    if ((data.metodoPago === 'Yape' || data.metodoPago === 'Transferencia') && !photoEvidence) {
      toast({
        title: "Foto de evidencia requerida",
        description: "Para pagos por Yape o Transferencia debe subir la foto del voucher.",
        variant: "destructive"
      });
      return;
    }
    // Validation: minor without guardian data
    if (age !== null && age < 18) {
      if (!data.responsable || !data.apellidoResponsable || !data.dniResponsable || !data.celularResponsable) {
        toast({
          title: "Datos del responsable incompletos",
          description: "El alumno es menor de edad. Debe ingresar los datos del responsable.",
          variant: "destructive"
        });
        return;
      }
    }
    // Validation: category out of age range requires observation
    if (ageOutOfCategory && !data.observaciones?.trim()) {
      toast({
        title: "Observación requerida",
        description: "Ha seleccionado una categoría fuera del rango de edad. Debe ingresar una observación explicando el motivo.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Solicitud enviada",
      description: "La solicitud de inscripción ha sido enviada correctamente al administrador.",
    });
    form.reset();
    setPhotoEvidence(null);
    setStudentPhoto(null);
    setAge(null);
    setObsTimestamp(null);
    setCategoryManuallyChanged(false);
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
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccione fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            {/* Selectores de Año y Mes */}
                            <div className="flex gap-2 p-3 border-b">
                              <Select
                                value={String(calendarMonth.getMonth())}
                                onValueChange={(val) => {
                                  const newDate = new Date(calendarMonth);
                                  newDate.setMonth(parseInt(val));
                                  setCalendarMonth(newDate);
                                }}
                              >
                                <SelectTrigger className="flex-1 h-9 text-sm">
                                  <SelectValue placeholder="Mes" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MONTHS.map((month, idx) => (
                                    <SelectItem key={idx} value={String(idx)}>{month}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={String(calendarMonth.getFullYear())}
                                onValueChange={(val) => {
                                  const newDate = new Date(calendarMonth);
                                  newDate.setFullYear(parseInt(val));
                                  setCalendarMonth(newDate);
                                }}
                              >
                                <SelectTrigger className="w-[100px] h-9 text-sm">
                                  <SelectValue placeholder="Año" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                  {YEARS.map((year) => (
                                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              month={calendarMonth}
                              onMonthChange={setCalendarMonth}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {age !== null && (
                          <p className="text-xs text-muted-foreground mt-1">Edad calculada: <strong>{age} años</strong></p>
                        )}
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
            <Card className={cn("shadow-lg border-primary/10 h-fit transition-all duration-500", !isPersonalDataComplete && "opacity-50")}>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Responsable y Contacto</CardTitle>
                <CardDescription>
                  {!isPersonalDataComplete
                    ? "Complete los datos personales primero."
                    : age !== null && age < 18
                    ? "El alumno es menor de edad, se requiere datos del tutor."
                    : "Datos de contacto directo."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {!isPersonalDataComplete ? (
                  <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground text-center italic">
                      Complete DNI, Nombres, Apellidos, Fecha de Nacimiento y Sexo para activar estos campos.
                    </p>
                  </div>
                ) : age !== null && age < 18 ? (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="responsable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombres del Responsable <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Nombres" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="apellidoResponsable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos del Responsable <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Apellidos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dniResponsable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DNI Responsable <span className="text-red-500">*</span></FormLabel>
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
                            <FormLabel>Celular Responsable <span className="text-red-500">*</span></FormLabel>
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
              </CardContent>
            </Card>

            {/* --- Sección: Academia y Horario --- */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Información de la Academia</CardTitle>
                <CardDescription>Deporte, temporada, horarios y categoría.</CardDescription>
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

                {/* Distrito */}
                <FormField
                  control={form.control}
                  name="distrito"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distrito</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione distrito" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DISTRITOS.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Categoría con auto-selección por edad */}
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setCategoryManuallyChanged(true);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACADEMY_CATEGORIES.map(cat => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {age !== null && field.value && ageOutOfCategory && (
                        <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md mt-1">
                          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700">
                            La categoría seleccionada no corresponde a la edad del alumno ({age} años). 
                            Se requiere una <strong>observación obligatoria</strong> para continuar.
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

            {/* --- Sección: Pago y Observaciones --- */}
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

                {/* Evidence Photo — shown for Yape/Transferencia */}
                {(watchPaymentMethod === "Yape" || watchPaymentMethod === "Transferencia") && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <label className="text-sm font-medium leading-none flex items-center gap-1">
                      Foto de Evidencia
                      <span className="text-red-500 text-xs ml-1">* (obligatoria)</span>
                    </label>
                    {/* Image upload area */}
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
                    {/* Change button when image is loaded */}
                    {photoEvidence && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2 w-full"
                        onClick={handleEvidenceUpload}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Cambiar
                      </Button>
                    )}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Observaciones
                        {ageOutOfCategory && <span className="text-red-500 text-xs ml-1">* (obligatorio por cambio de categoría)</span>}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Cualquier observación para el administrador..."
                          className={cn("min-h-[80px]", ageOutOfCategory && !watchObservaciones?.trim() && "border-amber-400 focus-visible:ring-amber-400")}
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            handleObsBlur();
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
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto px-12 bg-gradient-to-r from-primary to-blue-700 hover:opacity-90 transition-all font-bold"
            >
              Enviar solicitud de inscripción
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
