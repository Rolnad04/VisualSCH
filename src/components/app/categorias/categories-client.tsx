'use client';
import { useState, useEffect } from 'react';
import type { Category, Professor } from '@/lib/types';
import CategoryCard from './category-card';
import ProfessorList from './professor-list';
import CategoryViewSheet from './category-view-sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterX, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CategoriesClientProps = {
  initialCategories: Category[];
  initialProfessors: Professor[];
};

const ALL_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function isCategoryActiveNow(category: Category): boolean {
  // Use UTC-5 (Peru time)
  const nowUTC = new Date();
  const nowPeru = new Date(nowUTC.getTime() - 5 * 60 * 60 * 1000);
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const currentDay = dayNames[nowPeru.getUTCDay()];
  const currentHour = nowPeru.getUTCHours() + nowPeru.getUTCMinutes() / 60;

  if (!category.schedule.days.includes(currentDay)) return false;

  // Parse time range e.g. "10:00 a 12:00"
  const timeParts = category.schedule.time.split(' a ');
  if (timeParts.length !== 2) return false;
  const [startH, startM] = timeParts[0].split(':').map(Number);
  const [endH, endM] = timeParts[1].split(':').map(Number);
  const start = startH + startM / 60;
  const end = endH + endM / 60;

  return currentHour >= start && currentHour <= end;
}

function getCategoryStartHour(category: Category): number {
  const timeParts = category.schedule.time.split(' a ');
  if (timeParts.length < 1) return 24;
  const [h, m] = timeParts[0].split(':').map(Number);
  return h + (m || 0) / 60;
}

export function CategoriesClient({ initialCategories, initialProfessors }: CategoriesClientProps) {
  const { toast } = useToast();
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filterDay, setFilterDay] = useState('all');
  const [filterHour, setFilterHour] = useState('all');
  const [filterProfessor, setFilterProfessor] = useState('all');
  const [userRole, setUserRole] = useState<string | null>(null);

  // Local mutable state for categories and professors
  const [categoriesData, setCategoriesData] = useState<Category[]>(initialCategories);
  const [professorsData, setProfessorsData] = useState<Professor[]>(initialProfessors);

  // Create category dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    sport: 'Fútbol',
    ageMin: 6,
    ageMax: 12,
    maxCapacity: 20,
    price: 100,
    days: '',
    time: '',
    durationPerClass: '2 horas',
    frequency: '3 veces por semana',
    startDate: '',
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const isAdmin = userRole === 'Administrador';

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewSheetOpen(true);
  };

  const handleUpdateCategory = (updated: Category) => {
    setCategoriesData(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleUpdateProfessor = (updated: Professor) => {
    setProfessorsData(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddProfessor = (newProf: Professor) => {
    setProfessorsData(prev => [...prev, newProf]);
  };

  const handleCreateCategory = () => {
    const newCat: Category = {
      id: `cat-new-${Date.now()}`,
      name: createForm.name,
      sport: createForm.sport,
      ageRange: [createForm.ageMin, createForm.ageMax],
      maxCapacity: createForm.maxCapacity,
      enrolledStudents: 0,
      professors: [],
      schedule: {
        days: createForm.days.split(',').map(d => d.trim()).filter(Boolean),
        time: createForm.time,
        durationPerClass: createForm.durationPerClass,
        frequency: createForm.frequency,
      },
      price: createForm.price,
      startDate: createForm.startDate || new Date().toISOString().split('T')[0],
    };
    setCategoriesData(prev => [...prev, newCat]);
    setCreateOpen(false);
    setCreateForm({
      name: '', sport: 'Fútbol', ageMin: 6, ageMax: 12, maxCapacity: 20, price: 100,
      days: '', time: '', durationPerClass: '2 horas', frequency: '3 veces por semana', startDate: '',
    });
    toast({
      title: 'Categoría creada',
      description: `Se creó "${newCat.name}" correctamente.`,
    });
  };

  const handleClearFilters = () => {
    setFilterDay('all');
    setFilterHour('all');
    setFilterProfessor('all');
  };

  // Filter categories
  const filteredCategories = categoriesData.filter(cat => {
    if (filterDay !== 'all' && !cat.schedule.days.includes(filterDay)) return false;
    if (filterProfessor !== 'all' && !cat.professors.includes(filterProfessor)) return false;
    if (filterHour !== 'all') {
      const startH = getCategoryStartHour(cat);
      if (filterHour === 'mañana' && startH >= 12) return false;
      if (filterHour === 'tarde' && startH < 12) return false;
    }
    return true;
  });

  // Sort: active now first, then by start hour
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const aActive = isCategoryActiveNow(a);
    const bActive = isCategoryActiveNow(b);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return getCategoryStartHour(a) - getCategoryStartHour(b);
  });

  const professorNames = professorsData.map(p => p.name);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="p-4 bg-card border rounded-lg space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Filtrar categorías</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={filterDay} onValueChange={setFilterDay}>
                <SelectTrigger><SelectValue placeholder="Día" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los días</SelectItem>
                  {ALL_DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterHour} onValueChange={setFilterHour}>
                <SelectTrigger><SelectValue placeholder="Turno" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los turnos</SelectItem>
                  <SelectItem value="mañana">Mañana (antes de 12:00)</SelectItem>
                  <SelectItem value="tarde">Tarde (desde 12:00)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProfessor} onValueChange={setFilterProfessor}>
                <SelectTrigger><SelectValue placeholder="Profesor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los profesores</SelectItem>
                  {professorNames.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {(filterDay !== 'all' || filterHour !== 'all' || filterProfessor !== 'all') && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground">
                <FilterX className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Categorías</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{sortedCategories.length} categoría(s)</span>
              {isAdmin && (
                <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Agregar Categoría
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                professors={professorsData}
                onView={handleViewCategory}
                onUpdate={handleUpdateCategory}
                isActiveNow={isCategoryActiveNow(category)}
                userRole={userRole}
              />
            ))}
            {sortedCategories.length === 0 && (
              <div className="col-span-2 text-center p-10 text-muted-foreground border rounded-lg">
                No hay categorías que coincidan con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>
        <div>
          <ProfessorList
            professors={professorsData}
            categories={categoriesData}
            userRole={userRole}
            onUpdateProfessor={handleUpdateProfessor}
            onAddProfessor={handleAddProfessor}
          />
        </div>
      </div>
      
      <CategoryViewSheet 
        open={isViewSheetOpen}
        onOpenChange={setViewSheetOpen}
        category={selectedCategory}
        professors={professorsData}
      />

      {/* Create Category Dialog — Admin only */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
            <DialogDescription>Crea una nueva categoría de alumnos.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nombre</Label>
              <Input
                id="create-name"
                placeholder="Ej: Sub-10 Avanzado"
                value={createForm.name}
                onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-capacity">Cupos máximos</Label>
                <Input
                  id="create-capacity"
                  type="number"
                  min={1}
                  value={createForm.maxCapacity}
                  onChange={e => setCreateForm(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-price">Precio (S/)</Label>
                <Input
                  id="create-price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={createForm.price}
                  onChange={e => setCreateForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-age-min">Edad mínima</Label>
                <Input
                  id="create-age-min"
                  type="number"
                  min={3}
                  value={createForm.ageMin}
                  onChange={e => setCreateForm(prev => ({ ...prev, ageMin: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-age-max">Edad máxima</Label>
                <Input
                  id="create-age-max"
                  type="number"
                  min={3}
                  value={createForm.ageMax}
                  onChange={e => setCreateForm(prev => ({ ...prev, ageMax: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-days">Días activos</Label>
              <Input
                id="create-days"
                placeholder="Ej: Lunes, Miércoles, Viernes"
                value={createForm.days}
                onChange={e => setCreateForm(prev => ({ ...prev, days: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-time">Horario</Label>
                <Input
                  id="create-time"
                  placeholder="Ej: 10:00 a 12:00"
                  value={createForm.time}
                  onChange={e => setCreateForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-duration">Duración por clase</Label>
                <Input
                  id="create-duration"
                  placeholder="Ej: 2 horas"
                  value={createForm.durationPerClass}
                  onChange={e => setCreateForm(prev => ({ ...prev, durationPerClass: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-frequency">Frecuencia</Label>
                <Input
                  id="create-frequency"
                  placeholder="Ej: 3 veces por semana"
                  value={createForm.frequency}
                  onChange={e => setCreateForm(prev => ({ ...prev, frequency: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-start">Fecha de inicio</Label>
                <Input
                  id="create-start"
                  type="date"
                  value={createForm.startDate}
                  onChange={e => setCreateForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateCategory} disabled={!createForm.name.trim()}>Crear Categoría</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
