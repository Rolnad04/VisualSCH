'use client';
import { useState } from 'react';
import type { Category, Professor } from '@/lib/types';
import CategoryCard from './category-card';
import ProfessorList from './professor-list';
import CategoryViewSheet from './category-view-sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';

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
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filterDay, setFilterDay] = useState('all');
  const [filterHour, setFilterHour] = useState('all');
  const [filterProfessor, setFilterProfessor] = useState('all');

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewSheetOpen(true);
  };

  const handleClearFilters = () => {
    setFilterDay('all');
    setFilterHour('all');
    setFilterProfessor('all');
  };

  // Filter categories
  const filteredCategories = initialCategories.filter(cat => {
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

  const professorNames = initialProfessors.map(p => p.name);

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
            <span className="text-sm text-muted-foreground">{sortedCategories.length} categoría(s)</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                professors={initialProfessors}
                onView={handleViewCategory}
                isActiveNow={isCategoryActiveNow(category)}
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
          <ProfessorList professors={initialProfessors} categories={initialCategories} />
        </div>
      </div>
      
      <CategoryViewSheet 
        open={isViewSheetOpen}
        onOpenChange={setViewSheetOpen}
        category={selectedCategory}
        professors={initialProfessors}
      />
    </>
  );
}
