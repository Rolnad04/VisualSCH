import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Category } from '@/lib/types';
import { Users, Clock, Calendar, MoreHorizontal, Sun } from 'lucide-react';
import { format } from 'date-fns';

type CategoryCardProps = {
  category: Category;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
};

export default function CategoryCard({ category, onView, onEdit }: CategoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="font-headline">{category.name}</CardTitle>
          <CardDescription>{category.schedule.frequency}</CardDescription>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(category)}>Ver</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(category)}>Editar</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Deshabilitar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center text-center p-4 rounded-lg bg-primary/5">
            <p className="text-3xl font-bold text-primary">S/ {category.price.toFixed(2)}</p>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4"/>
                <span>{category.schedule.durationPerClass} por semana</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4"/>
                <span>{category.enrolledStudents} / {category.maxCapacity} alumnos</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4"/>
                <span>Inicia: {format(new Date(category.startDate), 'dd/MM/yyyy')}</span>
            </div>
             <div className="flex items-center gap-2">
                <Sun className="h-4 w-4"/>
                <span>{category.schedule.days.join(', ')}</span>
            </div>
        </div>
      </CardContent>
       <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onEdit(category)}>Editar</Button>
            <Button onClick={() => onView(category)}>Ver Alumnos</Button>
      </CardFooter>
    </Card>
  );
}
