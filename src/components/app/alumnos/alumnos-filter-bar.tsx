'use client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterX, Search } from 'lucide-react';
import { categories, seasons } from '@/lib/data';

type AlumnosFilterBarProps = {
  filters: any;
  setFilters: (filters: any) => void;
  onClear: () => void;
};

export default function AlumnosFilterBar({ filters, setFilters, onClear }: AlumnosFilterBarProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="p-4 bg-card border rounded-lg space-y-4">
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
              placeholder="Buscar por nombre, apellidos o DNI..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
          />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.paymentStatus} onValueChange={(value) => handleFilterChange('paymentStatus', value)}>
          <SelectTrigger><SelectValue placeholder="Estado de pago" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Al día">Al día</SelectItem>
            <SelectItem value="Deuda pendiente">Deuda pendiente</SelectItem>
            <SelectItem value="Próximo a vencer">Próximo a vencer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.season} onValueChange={(value) => handleFilterChange('season', value)}>
          <SelectTrigger><SelectValue placeholder="Temporada" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las temporadas</SelectItem>
            {seasons.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.sport} onValueChange={(value) => handleFilterChange('sport', value)}>
          <SelectTrigger><SelectValue placeholder="Deporte" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los deportes</SelectItem>
            <SelectItem value="Fútbol">Fútbol</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 xl:col-span-2">
            <Select value={filters.ageOperator} onValueChange={(value) => handleFilterChange('ageOperator', value)}>
                <SelectTrigger className="w-[120px] shrink-0">
                    <SelectValue placeholder="Edad" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Cualquier edad</SelectItem>
                    <SelectItem value="eq">Igual a</SelectItem>
                    <SelectItem value="lt">Menor a</SelectItem>
                    <SelectItem value="gt">Mayor a</SelectItem>
                    <SelectItem value="btw">Entre</SelectItem>
                </SelectContent>
            </Select>
            <Input 
                type="number"
                placeholder="Edad"
                className="flex-grow"
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                disabled={filters.ageOperator === 'all'}
            />
            {filters.ageOperator === 'btw' && (
                <Input 
                    type="number"
                    placeholder="Edad"
                    className="flex-grow"
                    value={filters.ageEnd}
                    onChange={(e) => handleFilterChange('ageEnd', e.target.value)}
                />
            )}
        </div>
      </div>
       <Button variant="ghost" onClick={onClear} className="text-muted-foreground w-full sm:w-auto">
            <FilterX className="mr-2 h-4 w-4" />
            Limpiar Filtros
       </Button>
    </div>
  );
}
