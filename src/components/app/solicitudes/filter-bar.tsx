'use client';

import { Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

type FilterBarProps = {
  status: string;
  setStatus: (status: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  promoter: string;
  setPromoter: (promoter: string) => void;
  promoters: string[];
  motive: string;
  setMotive: (motive: string) => void;
  motives: string[];
  onFilter: () => void;
  onClear: () => void;
};

export default function FilterBar({
  dateRange,
  setDateRange,
  promoter,
  setPromoter,
  promoters,
  motive,
  setMotive,
  motives,
  onFilter,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y', { locale: es })} -{' '}
                  {format(dateRange.to, 'LLL dd, y', { locale: es })}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y', { locale: es })
              )
            ) : (
              <span>Seleccionar fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Select value={promoter} onValueChange={setPromoter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Promotora" />
        </SelectTrigger>
        <SelectContent>
          {promoters.map((p) => (
            <SelectItem key={p} value={p}>{p === 'all' ? 'Todas las promotoras' : p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={motive} onValueChange={setMotive}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Motivo" />
        </SelectTrigger>
        <SelectContent>
          {motives.map((m) => (
            <SelectItem key={m} value={m}>{m === 'all' ? 'Todos los motivos' : m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button onClick={onFilter}>Filtrar</Button>
      <Button variant="ghost" onClick={onClear} className="text-muted-foreground">
        <FilterX className="mr-2 h-4 w-4"/>
        Limpiar
      </Button>
    </div>
  );
}
