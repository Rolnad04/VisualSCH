'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CreditCard, History, UserCheck, Eye, Edit, Save,
  ShieldOff, ShieldCheck, Loader2,
  ArrowLeft, Barcode, CheckCircle2, XCircle
} from 'lucide-react';
import { professors, categories } from '@/lib/data';
import { StudentService } from '@/lib/student-actions';

type ViewType = 'main' | 'payments' | 'history' | 'attendance' | 'carnet' | 'edit';

type AlumnoViewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onToggleStatus?: (id: string, currentStatus: boolean) => Promise<void>;
  onUpdateStudent?: (id: string, updatedData: Partial<Student>) => void;
};

// ── Datos simulados para las vistas secundarias ──────────────────────────
const paymentsData = [
  { month: 'Enero', amount: 'S/ 120', status: 'Pagado' },
  { month: 'Febrero', amount: 'S/ 120', status: 'Pagado' },
  { month: 'Marzo', amount: 'S/ 120', status: 'Pendiente' },
];

const purchaseHistory = [
  { date: '12/01/2026', product: 'Camiseta Oficial', amount: 'S/ 85' },
  { date: '18/02/2026', product: 'Short', amount: 'S/ 45' },
  { date: '05/03/2026', product: 'Medias', amount: 'S/ 25' },
];

const attendanceData = [
  { date: 'Lun 12/05/2026', status: true },
  { date: 'Mié 14/05/2026', status: true },
  { date: 'Vie 16/05/2026', status: false },
  { date: 'Lun 19/05/2026', status: true },
  { date: 'Mié 21/05/2026', status: true },
  { date: 'Vie 23/05/2026', status: false },
];

// ── Botón reutilizable para volver a la ficha principal ──────────────────
function BackButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <Button variant="ghost" onClick={onClick} className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
      <ArrowLeft className="mr-2 h-4 w-4" /> {label || 'Volver a la ficha'}
    </Button>
  );
}

// ── Vista: Control de Pagos ──────────────────────────────────────────────
function PaymentsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Control de Pagos</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mes</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead className="text-right">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentsData.map((row) => (
            <TableRow key={row.month}>
              <TableCell className="font-medium">{row.month}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell className="text-right">
                <Badge variant={row.status === 'Pagado' ? 'default' : 'destructive'}
                  className={row.status === 'Pagado' ? 'bg-green-600 hover:bg-green-700' : ''}>
                  {row.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Vista: Historial de Compras ──────────────────────────────────────────
function HistoryView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Historial de Compras</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseHistory.map((row) => (
            <TableRow key={row.product}>
              <TableCell className="text-muted-foreground">{row.date}</TableCell>
              <TableCell className="font-medium">{row.product}</TableCell>
              <TableCell className="text-right font-semibold">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Vista: Asistencia ────────────────────────────────────────────────────
function AttendanceView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Registro de Asistencia</h3>
      <div className="space-y-2">
        {attendanceData.map((entry) => (
          <div key={entry.date} className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <span className="text-sm font-medium">{entry.date}</span>
            {entry.status ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Asistió</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-500">
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">Faltó</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Vista: Carnet / Fotocheck ────────────────────────────────────────────
function CarnetView({ student, onBack }: { student: Student; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Carnet de Alumno</h3>
      <div className="mx-auto max-w-xs border-2 border-border rounded-xl bg-white shadow-lg overflow-hidden">
        {/* Encabezado del carnet */}
        <div className="bg-primary px-4 py-3 text-center">
          <p className="text-primary-foreground font-bold text-sm tracking-widest uppercase">
            Sporting Club Huaraz
          </p>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col items-center gap-3 px-6 py-6">
          <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2">
            <AvatarImage src={student.photoUrl} alt={student.name} />
            <AvatarFallback className="text-xl">{student.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <p className="font-bold text-lg text-foreground">{student.name}</p>
            <p className="text-muted-foreground text-sm">DNI: {student.dni}</p>
            <Badge variant="secondary" className="mt-1">{student.category}</Badge>
          </div>
        </div>

        {/* Código de barras simulado */}
        <div className="border-t border-dashed border-border px-6 py-4 flex justify-center">
          <Barcode className="w-32 h-12 mx-auto text-foreground" />
        </div>
      </div>
    </div>
  );
}

// ── Vista: Edición de Alumno ─────────────────────────────────────────────
function EditView({ student, onBack, onSave }: {
  student: Student;
  onBack: () => void;
  onSave: (id: string, data: Partial<Student>) => void;
}) {
  const [formData, setFormData] = useState({
    name: student.name,
    dni: student.dni,
    age: String(student.age),
    phone: student.phone || '',
    category: student.category,
    guardianName: student.guardian?.name || '',
    guardianDni: student.guardian?.dni || '',
    guardianPhone: student.guardian?.phone || '',
  });

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isMinor = parseInt(formData.age, 10) < 18;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updatedData: Partial<Student> = {
      name: fd.get('name') as string,
      dni: fd.get('dni') as string,
      age: Number(fd.get('age')),
      phone: fd.get('phone') as string,
      category: fd.get('category') as string,
    };

    // Lógica condicional del responsable
    if (updatedData.age && updatedData.age < 18) {
      updatedData.guardian = {
        name: fd.get('guardianName') as string,
        dni: fd.get('guardianDni') as string,
        phone: fd.get('guardianPhone') as string,
      };
    } else {
      updatedData.guardian = undefined;
    }

    onSave(student.id, updatedData);
  };

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} label="Cancelar Edición" />
      <h3 className="text-lg font-semibold font-headline">Editar Alumno</h3>
      <form onSubmit={handleSave} className="space-y-4">
        {/* ── Datos del Alumno ──────────────────────────────────── */}
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nombre completo</Label>
          <Input
            id="edit-name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-dni">DNI</Label>
          <Input
            id="edit-dni"
            name="dni"
            value={formData.dni}
            onChange={(e) => handleChange('dni', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-age">Edad</Label>
            <Input
              id="edit-age"
              name="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Teléfono</Label>
            <Input
              id="edit-phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Ej: 943 123 456"
            />
          </div>
        </div>

        {/* ── Lógica Condicional: Datos del Responsable (Edad < 18) ── */}
        {isMinor && (
          <div className="p-4 bg-muted rounded-lg space-y-4">
            <p className="font-semibold text-xs tracking-wide uppercase text-muted-foreground">Datos del Responsable</p>
            <div className="space-y-2">
              <Label htmlFor="edit-guardian-name">Nombre del Apoderado</Label>
              <Input
                id="edit-guardian-name"
                name="guardianName"
                value={formData.guardianName}
                onChange={(e) => handleChange('guardianName', e.target.value)}
                placeholder="Nombre completo del apoderado"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-guardian-dni">DNI del Apoderado</Label>
                <Input
                  id="edit-guardian-dni"
                  name="guardianDni"
                  value={formData.guardianDni}
                  onChange={(e) => handleChange('guardianDni', e.target.value)}
                  placeholder="12345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-guardian-phone">Celular del Apoderado</Label>
                <Input
                  id="edit-guardian-phone"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => handleChange('guardianPhone', e.target.value)}
                  placeholder="Ej: 943 123 456"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Selector de Categoría ─────────────────────────────── */}
        <div className="space-y-2">
          <Label>Categoría</Label>
          {/* Hidden input para que FormData capture el valor del Select */}
          <input type="hidden" name="category" value={formData.category} />
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" /> Guardar Cambios
        </Button>
      </form>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────
export default function AlumnoViewSheet({ open, onOpenChange, student, onToggleStatus, onUpdateStudent }: AlumnoViewSheetProps) {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActive, setIsActive] = useState(student?.isActive !== false);

  // ── Simulación de sesión de usuario (Seguridad PEA / Hardware) ──────────
  const currentUser = {
    role: 'admin' as 'admin' | 'promoter',
    deviceId: 'AUTH-WEB-001',
  };

  const isAdmin = currentUser.role === 'admin';

  // Resetear la vista al cerrar el Sheet
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setCurrentView('main');
    }
    onOpenChange(isOpen);
  };

  if (!student) return null;

  const professor = professors.find(p => p.id === student.professorId);

  const handleToggleStatus = async () => {
    setIsProcessing(true);
    try {
      // Delegar al padre (Optimistic UI + Rollback)
      await onToggleStatus?.(student.id, isActive);
      // Si el padre no revirtió, actualizar el estado local
      setIsActive(prev => !prev);
    } catch {
      // El padre ya hizo rollback, no cambiamos isActive
    } finally {
      setIsProcessing(false);
    }
  };

  const goToMain = () => setCurrentView('main');

  // ── Títulos dinámicos según la vista ────────────────────────────────────
  const viewTitles: Record<ViewType, string> = {
    main: 'Ficha de Alumno',
    payments: 'Control de Pagos',
    history: 'Historial de Compras',
    attendance: 'Asistencia',
    carnet: 'Carnet',
    edit: 'Editar Alumno',
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-xl w-[90vw] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>{viewTitles[currentView]}</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {/* ── VISTA PRINCIPAL ─────────────────────────────────────── */}
          {currentView === 'main' && (
            <>
              <div className="grid gap-4">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={student.photoUrl} alt={student.name} />
                    <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold font-headline">{student.name}</h2>
                    <p className="text-muted-foreground">DNI: {student.dni}</p>
                  </div>
                  {/* Botón Editar: solo visible para admin */}
                  {isAdmin && (
                    <Button variant="outline" size="icon" className="absolute top-4 right-16"
                      onClick={() => setCurrentView('edit')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base">Información Personal</h3>
                    <p><strong className="font-medium">DNI:</strong> {student.dni}</p>
                    <p><strong className="font-medium">Género:</strong> {student.gender}</p>
                    <p><strong className="font-medium">Edad:</strong> {student.age} años</p>
                    {student.phone && <p><strong className="font-medium">Teléfono:</strong> {student.phone}</p>}
                    {student.guardian && (
                      <div className="p-3 bg-muted rounded-md space-y-1">
                        <p className="font-semibold text-xs">RESPONSABLE</p>
                        <p><strong className="font-medium">Nombre:</strong> {student.guardian.name}</p>
                        <p><strong className="font-medium">DNI:</strong> {student.guardian.dni}</p>
                        <p><strong className="font-medium">Celular:</strong> {student.guardian.phone}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-base">Información Académica</h3>
                    <p><strong className="font-medium">Deporte:</strong> {student.sport}</p>
                    <p><strong className="font-medium">Temporada:</strong> {student.season}</p>
                    <p><strong className="font-medium">Categoría:</strong> {student.category}</p>
                    <p><strong className="font-medium">Profesor:</strong> {professor?.name}</p>
                    <p><strong className="font-medium">Estado de Pago:</strong> <span className="font-bold text-primary">{student.paymentStatus}</span></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-base">Estadísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-md text-center">
                      <p className="text-2xl font-bold">{student.totalPayments}</p>
                      <p className="text-xs text-muted-foreground">Pagos Totales</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md text-center">
                      <p className="text-2xl font-bold">{student.totalAttendance}</p>
                      <p className="text-xs text-muted-foreground">Asistencias Totales</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Footer con botones de acción ──────────────────────── */}
              <SheetFooter className="flex flex-row flex-wrap justify-start sm:justify-end gap-2 pt-6">
                <Button variant="outline" size="sm" className="h-auto py-2"
                  onClick={() => setCurrentView('payments')}>
                  <CreditCard className="mr-2 h-4 w-4" /> Control de Pagos
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-2"
                  onClick={() => setCurrentView('history')}>
                  <History className="mr-2 h-4 w-4" /> Historial
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-2"
                  onClick={() => setCurrentView('attendance')}>
                  <UserCheck className="mr-2 h-4 w-4" /> Asistencia
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-2"
                  onClick={() => setCurrentView('carnet')}>
                  <Eye className="mr-2 h-4 w-4" /> Visualizar Carnet
                </Button>
                {/* Botón Deshabilitar/Rehabilitar: solo para admin */}
                {isAdmin && (
                  <Button
                    variant={isActive ? 'destructive' : 'default'}
                    size="sm"
                    className={`h-auto py-2 ${!isActive ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    onClick={handleToggleStatus}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isActive ? (
                      <ShieldOff className="mr-2 h-4 w-4" />
                    ) : (
                      <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    {isProcessing ? 'Procesando...' : isActive ? 'Deshabilitar' : 'Rehabilitar'}
                  </Button>
                )}
                <SheetClose asChild>
                  <Button>Cerrar</Button>
                </SheetClose>
              </SheetFooter>
            </>
          )}

          {/* ── VISTAS SECUNDARIAS ─────────────────────────────────── */}
          {currentView === 'payments' && <PaymentsView onBack={goToMain} />}
          {currentView === 'history' && <HistoryView onBack={goToMain} />}
          {currentView === 'attendance' && <AttendanceView onBack={goToMain} />}
          {currentView === 'carnet' && <CarnetView student={student} onBack={goToMain} />}
          {currentView === 'edit' && (
            <EditView
              student={student}
              onBack={goToMain}
              onSave={(id, data) => {
                onUpdateStudent?.(id, data);
                setCurrentView('main');
              }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
