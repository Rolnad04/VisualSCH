'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { attendances, categories, professors, students, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AsistenciaPage() {
  const [filters, setFilters] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'all',
    professor: 'all',
    promoter: 'all',
    sport: 'Fútbol',
    status: 'all',
  });

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
  
  const filteredAttendances = attendances
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


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Control de Asistencia</h1>
          <p className="text-muted-foreground">Visualiza la asistencia de los alumnos por fecha.</p>
        </div>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAttendances.map((item) => item && (
          <Card key={item.id} className={cn("p-4 transition-all", item.status === 'Presente' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30')}>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2" style={{ borderColor: item.status === 'Presente' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
                <AvatarImage src={item.student.photoUrl} />
                <AvatarFallback>{item.student.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-semibold">{item.student.name}</p>
                <p className="text-sm text-muted-foreground">{item.student.category}</p>
                <p className="text-xs text-muted-foreground">{item.student.sport}</p>
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
  );
}
