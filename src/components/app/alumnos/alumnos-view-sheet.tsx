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

import { professors, categories, requests, attendances } from '@/lib/data';

type ViewType = 'main' | 'payments' | 'history' | 'attendance' | 'carnet' | 'edit';

type AlumnoViewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onToggleStatus?: (id: string, currentStatus: boolean) => Promise<void>;
  onUpdateStudent?: (id: string, updatedData: Partial<Student>) => void;
};

function BackButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <Button variant="ghost" onClick={onClick} className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
      <ArrowLeft className="mr-2 h-4 w-4" /> {label || 'Volver a la ficha'}
    </Button>
  );
}

function PaymentsView({ student, onBack }: { student: Student; onBack: () => void }) {
  // Calculamos cuántos meses lleva en el club según tu data real
  const mesesRegistrados = (student.totalPayments || 0) + (student.monthsOwed || 0);
  const mesesCount = Math.min(Math.max(mesesRegistrados, 1), 4); // Tope de 4 meses hasta Abril

  const allMonths = ['Enero', 'Febrero', 'Marzo', 'Abril'];
  // Si entró en Marzo (2 meses), cortamos el array para que solo muestre ['Marzo', 'Abril']
  const displayMonths = allMonths.slice(4 - mesesCount);

  const displayPayments = displayMonths.map((mes, index) => {
    // Si está al día, todo lo que se muestra es pagado. Si no, se evalúa.
    const isPagado = student.paymentStatus === 'Al día' || index < (student.totalPayments || 0);
    return {
      month: mes,
      amount: 'S/ 30.00',
      status: isPagado ? 'Pagado' : 'Pendiente'
    };
  });

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
          {displayPayments.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium capitalize">{row.month}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell className="text-right">
                <Badge variant={row.status === 'Pagado' ? 'default' : 'destructive'}
                  className={row.status === 'Pagado' ? 'bg-green-600' : 'bg-red-600'}>
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

function HistoryView({ student, onBack }: { student: Student; onBack: () => void }) {
  // LEE DIRECTAMENTE DEL OBJETO DEL ALUMNO. Cero filtros externos.
  const purchaseHistory = student.purchases || [];

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Historial de Compras</h3>

      {purchaseHistory.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground border rounded-lg bg-muted/20">
          No ha realizado compras en la tienda.
        </div>
      ) : (
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
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(row.date).toLocaleDateString('es-PE')}
                </TableCell>
                <TableCell className="font-medium">{row.productName}</TableCell>
                <TableCell className="text-right font-semibold">
                  S/ {row.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// ── VISTA ASISTENCIA ──
function AttendanceView({ student, onBack }: { student: Student; onBack: () => void }) {
  const categoryInfo = categories.find(c => c.name === student.category);
  const corte = new Date(2026, 4, 6); // Corte de auditoría: 06/05/2026

  // La misma matemática exacta de los pagos para no contradecirse
  const getStartDateExacta = () => {
    const mesesRegistrados = (student.totalPayments || 0) + (student.monthsOwed || 0);
    const mesesCount = Math.min(Math.max(mesesRegistrados, 1), 4);

    // Inicio estricto el día 8 del mes que le corresponde
    if (mesesCount >= 4) return new Date(2026, 0, 8); // 08/01/2026 (Enero)
    if (mesesCount === 3) return new Date(2026, 1, 8); // 08/02/2026 (Febrero)
    if (mesesCount === 2) return new Date(2026, 2, 8); // 08/03/2026 (Marzo)
    return new Date(2026, 3, 8);                       // 08/04/2026 (Abril)
  };

  const startDate = getStartDateExacta();

  const generarHistorialCoherente = () => {
    const historial = [];
    const diasPermitidos = categoryInfo?.schedule.days || ['Lunes', 'Miércoles', 'Viernes'];
    const mapaDias: Record<string, number> = { 'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6 };
    const diasIds = diasPermitidos.map(d => mapaDias[d]);

    let fechaRecorrido = new Date(corte);

    // Recorre desde el 06/05 hasta el día 8 del mes de inicio
    while (fechaRecorrido >= startDate) {
      if (diasIds.includes(fechaRecorrido.getDay())) {
        historial.push({
          id: `att-${fechaRecorrido.getTime()}`,
          date: fechaRecorrido.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }),
          status: Math.random() > 0.1 ? 'Presente' : 'Falta'
        });
      }
      fechaRecorrido.setDate(fechaRecorrido.getDate() - 1);
    }
    return historial;
  };

  const studentAttendances = generarHistorialCoherente();

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Asistencia</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {studentAttendances.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No hay registros de asistencia disponibles.</p>
        ) : (
          studentAttendances.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <span className="text-sm font-medium capitalize">{entry.date}</span>
              <Badge variant={entry.status === 'Presente' ? 'default' : 'destructive'}
                className={entry.status === 'Presente' ? 'bg-green-600' : 'bg-red-600'}>
                {entry.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CarnetView({ student, onBack }: { student: Student; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Carnet Digital</h3>
      <div className="flex justify-center p-4">
        <div className="relative w-80 h-48 bg-gradient-to-br from-indigo-900 via-blue-950 to-slate-900 rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden text-white p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-white/10 pb-2 z-10">
            <div><p className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Sporting Club</p></div>
            <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30 font-semibold">ACTIVO</span>
          </div>
          <div className="flex gap-4 items-center my-3 z-10">
            <Avatar className="w-16 h-16 border-2 border-white/20"><AvatarImage src={student.photoUrl} alt={student.name} /><AvatarFallback className="bg-slate-800 text-white font-bold">{student.name.substring(0, 2)}</AvatarFallback></Avatar>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-bold truncate">{student.name}</p>
              <p className="text-[10px] text-slate-300">DNI: {student.dni}</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-2 z-10">
            <Barcode className="h-6 w-12 text-slate-300" />
            <p className="text-[8px] text-slate-400 font-semibold">{student.season}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditView({ student, onBack, onUpdate }: { student: Student; onBack: () => void; onUpdate?: (id: string, updatedData: Partial<Student>) => void; }) {
  const [name, setName] = useState(student.name);
  const [dni, setDni] = useState(student.dni);
  const [age, setAge] = useState(student.age.toString());
  const [gender, setGender] = useState<'Masculino' | 'Femenino'>(student.gender);
  const [phone, setPhone] = useState(student.phone || '');
  const [guardianName, setGuardianName] = useState(student.guardian?.name || '');
  const [guardianDni, setGuardianDni] = useState(student.guardian?.dni || '');
  const [guardianPhone, setGuardianPhone] = useState(student.guardian?.phone || '');
  const [sport, setSport] = useState(student.sport);
  const [category, setCategory] = useState(student.category);
  const [season, setSeason] = useState(student.season);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdate) return;
    onUpdate(student.id, {
      name, dni, age: parseInt(age) || student.age, gender, phone: phone || undefined,
      guardian: { name: guardianName, dni: guardianDni, phone: guardianPhone },
      sport, category, season,
    });
    onBack();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BackButton onClick={onBack} />
      <h3 className="text-lg font-semibold font-headline">Editar Ficha del Alumno</h3>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div className="space-y-1.5"><Label htmlFor="edit-name">Nombre Completo</Label><Input id="edit-name" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label htmlFor="edit-dni">DNI</Label><Input id="edit-dni" value={dni} onChange={e => setDni(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label htmlFor="edit-age">Edad</Label><Input id="edit-age" type="number" value={age} onChange={e => setAge(e.target.value)} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label htmlFor="edit-gender">Género</Label><Select value={gender} onValueChange={(val: 'Masculino' | 'Femenino') => setGender(val)}><SelectTrigger id="edit-gender"><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Femenino">Femenino</SelectItem></SelectContent></Select></div>
          <div className="space-y-1.5"><Label htmlFor="edit-phone">Celular</Label><Input id="edit-phone" value={phone} onChange={e => setPhone(e.target.value)} /></div>
        </div>
        <Separator />
        <h4 className="text-sm font-semibold">Datos del Apoderado</h4>
        <div className="space-y-1.5"><Label htmlFor="edit-gname">Nombre del Apoderado</Label><Input id="edit-gname" value={guardianName} onChange={e => setGuardianName(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label htmlFor="edit-gdni">DNI del Apoderado</Label><Input id="edit-gdni" value={guardianDni} onChange={e => setGuardianDni(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="edit-gphone">Celular del Apoderado</Label><Input id="edit-gphone" value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} /></div>
        </div>
        <Separator />
        <h4 className="text-sm font-semibold">Datos Académicos / Deportivos</h4>
        <div className="space-y-1.5"><Label htmlFor="edit-sport">Deporte</Label><Input id="edit-sport" value={sport} onChange={e => setSport(e.target.value)} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label htmlFor="edit-category">Categoría</Label><Input id="edit-category" value={category} onChange={e => setCategory(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label htmlFor="edit-season">Temporada</Label><Input id="edit-season" value={season} onChange={e => setSeason(e.target.value)} required /></div>
        </div>
      </div>
      <div className="flex gap-2 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onBack}>Cancelar</Button><Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">Guardar Cambios</Button></div>
    </form>
  );
}

export default function AlumnoViewSheet({ open, onOpenChange, student, onToggleStatus, onUpdateStudent }: AlumnoViewSheetProps) {
  const [view, setView] = useState<ViewType>('main');
  const [isToggling, setIsToggling] = useState(false);
  const handleOpenChange = (isOpen: boolean) => { onOpenChange(isOpen); if (!isOpen) setView('main'); };
  if (!student) return null;
  const handleToggleClick = async () => { if (!onToggleStatus) return; setIsToggling(true); try { await onToggleStatus(student.id, student.isActive !== false); } finally { setIsToggling(false); } };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4"><SheetTitle className="text-xl font-bold font-headline">Ficha del Alumno</SheetTitle></SheetHeader>
        {view === 'main' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border"><AvatarImage src={student.photoUrl} alt={student.name} /><AvatarFallback className="text-lg font-bold">{student.name.substring(0, 2)}</AvatarFallback></Avatar>
              <div>
                <h3 className="text-lg font-bold">{student.name}</h3>
                <p className="text-sm text-muted-foreground">DNI: {student.dni}</p>
                <div className="flex items-center gap-2 mt-1"><Badge variant={student.isActive !== false ? 'default' : 'destructive'} className="text-[10px]">{student.isActive !== false ? 'ACTIVO' : 'INACTIVO'}</Badge><Badge variant="outline" className="text-[10px]">{student.paymentStatus}</Badge></div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Datos Personales</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm"><div><span className="text-muted-foreground block text-xs">Edad</span><span className="font-medium">{student.age} años</span></div><div><span className="text-muted-foreground block text-xs">Género</span><span className="font-medium">{student.gender}</span></div>{student.phone && (<div className="col-span-2 mt-1"><span className="text-muted-foreground block text-xs">Celular</span><span className="font-medium">{student.phone}</span></div>)}</div>
            </div>
            {student.guardian && (<><Separator /><div className="space-y-3"><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Apoderado</h4><div className="grid grid-cols-2 gap-y-2 text-sm"><div className="col-span-2"><span className="text-muted-foreground block text-xs">Nombre</span><span className="font-medium">{student.guardian.name}</span></div><div><span className="text-muted-foreground block text-xs">DNI</span><span className="font-medium">{student.guardian.dni}</span></div><div><span className="text-muted-foreground block text-xs">Celular</span><span className="font-medium">{student.guardian.phone}</span></div></div></div></>)}
            <Separator />
            <div className="space-y-3"><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Información Deportiva</h4><div className="grid grid-cols-2 gap-y-2 text-sm"><div><span className="text-muted-foreground block text-xs">Deporte</span><span className="font-medium">{student.sport}</span></div><div><span className="text-muted-foreground block text-xs">Categoría</span><span className="font-medium">{student.category}</span></div><div className="col-span-2 mt-1"><span className="text-muted-foreground block text-xs">Temporada</span><span className="font-medium">{student.season}</span></div></div></div>
            <Separator />
            <div className="grid grid-cols-2 gap-2"><Button variant="outline" size="sm" onClick={() => setView('payments')} className="justify-start gap-2"><CreditCard className="h-4 w-4 text-blue-500" /><span>Control de Pagos</span></Button><Button variant="outline" size="sm" onClick={() => setView('history')} className="justify-start gap-2"><History className="h-4 w-4 text-purple-500" /><span>Historial</span></Button><Button variant="outline" size="sm" onClick={() => setView('attendance')} className="justify-start gap-2"><UserCheck className="h-4 w-4 text-green-500" /><span>Asistencia</span></Button><Button variant="outline" size="sm" onClick={() => setView('carnet')} className="justify-start gap-2"><Eye className="h-4 w-4 text-orange-500" /><span>Carnet Digital</span></Button><Button variant="outline" size="sm" onClick={() => setView('edit')} className="col-span-2 justify-start gap-2"><Edit className="h-4 w-4 text-gray-500" /><span>Editar Ficha</span></Button></div>
            <Separator />
            <div className="pt-2"><Button variant={student.isActive !== false ? 'destructive' : 'default'} className={student.isActive !== false ? 'w-full' : 'w-full bg-green-600 hover:bg-green-700'} disabled={isToggling} onClick={handleToggleClick}>{isToggling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : student.isActive !== false ? <ShieldOff className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}{student.isActive !== false ? 'Desactivar Alumno' : 'Activar Alumno'}</Button></div>
          </div>
        )}
        {view === 'payments' && <PaymentsView student={student} onBack={() => setView('main')} />}
        {view === 'history' && <HistoryView student={student} onBack={() => setView('main')} />}
        {view === 'attendance' && <AttendanceView student={student} onBack={() => setView('main')} />}
        {view === 'carnet' && <CarnetView student={student} onBack={() => setView('main')} />}
        {view === 'edit' && <EditView student={student} onBack={() => setView('main')} onUpdate={onUpdateStudent} />}
      </SheetContent>
    </Sheet>
  );
}