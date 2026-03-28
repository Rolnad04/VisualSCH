'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { attendances as initialAttendances, categories, professors, students, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FilterX, CheckCircle2, Clock, Save, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Attendance } from '@/lib/types';

export default function AsistenciaPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'all',
    professor: 'all',
    promoter: 'all',
    sport: 'Fútbol',
    status: 'all',
  });

  const [localAttendances, setLocalAttendances] = useState<Attendance[]>(initialAttendances);
  const [newlyMarked, setNewlyMarked] = useState<Set<string>>(new Set());

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({
        date: format(new Date(), 'yyyy-MM-dd'),
        category: 'all',
        professor: 'all',
        promoter: 'all',
        sport: 'Fútbol',
        status: 'all',
    });
  }
  
  const promoterOptions = users.filter(u => u.role === 'Promotora');
  
  // Students with registered attendance for the date
  const filteredAttendances = useMemo(() => {
    return localAttendances
      .filter(att => att.date === filters.date)
      .map(att => {
          const student = students.find(s => s.id === att.studentId);
          if (!student) return null;
          
          if(filters.category !== 'all' && student.category !== filters.category) return null;
          if(filters.professor !== 'all' && student.professorId !== filters.professor) return null;
          if(filters.promoter !== 'all' && att.promoterId !== filters.promoter) return null;
          if(filters.sport !== 'all' && student.sport !== filters.sport) return null;
          if(filters.status !== 'all' && att.status !== filters.status) return null;
          
          return { ...att, student };
      }).filter(Boolean);
  }, [localAttendances, filters]);

  // Students WITHOUT attendance for the date (unregistered)
  const studentsWithoutAttendance = useMemo(() => {
    const registeredIds = localAttendances
      .filter(att => att.date === filters.date)
      .map(att => att.studentId);
    
    return students.filter(student => {
      if (registeredIds.includes(student.id)) return false;
      if (filters.category !== 'all' && student.category !== filters.category) return false;
      if (filters.professor !== 'all' && student.professorId !== filters.professor) return false;
      if (filters.sport !== 'all' && student.sport !== filters.sport) return false;
      return true;
    });
  }, [localAttendances, filters]);

  const handleMarkPresent = (studentId: string) => {
    const newAttendance: Attendance = {
      id: `att-new-${Date.now()}-${studentId}`,
      studentId,
      date: filters.date,
      status: 'Presente',
      promoterId: 'user-2', // Current promoter
    };
    setLocalAttendances(prev => [...prev, newAttendance]);
    setNewlyMarked(prev => new Set(prev).add(studentId));
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Asistencia guardada",
      description: `Se registraron ${newlyMarked.size} asistencia(s) correctamente.`,
    });
    setNewlyMarked(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Control de Asistencia</h1>
          <p className="text-muted-foreground">Marca y visualiza la asistencia de los alumnos por fecha.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-full md:w-auto">
              <Label htmlFor="date">Fecha</Label>
              <Input 
                  id="date" 
                  type="date"
                  value={filters.date}
                  onChange={e => handleFilterChange('date', e.target.value)}
                  className="w-full md:w-[180px]"
              />
          </div>
          {newlyMarked.size > 0 && (
            <Button 
              onClick={handleSaveAttendance}
              className="mt-5 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 animate-in fade-in duration-300"
            >
              <Save className="h-4 w-4" />
              Guardar ({newlyMarked.size})
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-card border rounded-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filters.professor} onValueChange={(v) => handleFilterChange('professor', v)}>
                <SelectTrigger><SelectValue placeholder="Profesor" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los profesores</SelectItem>
                    {professors.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select value={filters.promoter} onValueChange={(v) => handleFilterChange('promoter', v)}>
                <SelectTrigger><SelectValue placeholder="Promotora" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las promotoras</SelectItem>
                    {promoterOptions.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filters.sport} onValueChange={(v) => handleFilterChange('sport', v)}>
                <SelectTrigger><SelectValue placeholder="Deporte" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los deportes</SelectItem>
                    <SelectItem value="Fútbol">Fútbol</SelectItem>
                </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                <SelectTrigger><SelectValue placeholder="Estado de asistencia" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Presente">Presentes</SelectItem>
                    <SelectItem value="Falta">Faltas</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button variant="ghost" onClick={handleClear} className="text-muted-foreground w-full sm:w-auto">
            <FilterX className="mr-2 h-4 w-4" />
            Limpiar Filtros
       </Button>
      </div>

      {/* Alumnos sin marcar asistencia */}
      {studentsWithoutAttendance.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold">Pendientes de marcar ({studentsWithoutAttendance.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {studentsWithoutAttendance.map((student) => (
              <Card key={student.id} className="p-4 border-amber-500/20 bg-amber-500/5 transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-amber-400/50">
                    <AvatarImage src={student.photoUrl} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.category}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-green-500/50 text-green-700 hover:bg-green-500/10 hover:text-green-800 shrink-0"
                    onClick={() => handleMarkPresent(student.id)}
                  >
                    <UserCheck className="h-4 w-4" />
                    Presente
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Asistencias registradas */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Registrados ({filteredAttendances.length})</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAttendances.map((item) => item && (
            <Card 
              key={item.id} 
              className={cn(
                "p-4 transition-all",
                item.status === 'Presente' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30',
                newlyMarked.has(item.studentId) && 'ring-2 ring-green-400 animate-in fade-in slide-in-from-bottom-2 duration-500'
              )}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2" style={{ borderColor: item.status === 'Presente' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
                  <AvatarImage src={item.student.photoUrl} />
                  <AvatarFallback>{item.student.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <p className="font-semibold">{item.student.name}</p>
                  <p className="text-sm text-muted-foreground">{item.student.category}</p>
                  <p className="text-xs text-muted-foreground">{item.student.sport}</p>
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  item.status === 'Presente' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'
                )}>
                  {item.status}
                </div>
              </div>
            </Card>
          ))}
          {filteredAttendances.length === 0 && (
              <div className="col-span-full text-center p-10 text-muted-foreground">
                  No hay registros de asistencia para la fecha y filtros seleccionados.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
