import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Category, Professor } from '@/lib/types';
import { Users, Clock, Calendar, Sun, CheckCircle2, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type CategoryCardProps = {
  category: Category;
  professors: Professor[];
  onView: (category: Category) => void;
  isActiveNow?: boolean;
};

export default function CategoryCard({ category, professors, onView, isActiveNow }: CategoryCardProps) {
  const categoryProfessors = professors.filter(p => category.professors.includes(p.name));

  return (
    <Card className={isActiveNow ? 'border-green-500/50 shadow-green-500/10 shadow-md' : ''}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="font-headline">{category.name}</CardTitle>
            {isActiveNow && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-[10px] gap-1 px-1.5 py-0.5">
                <CheckCircle2 className="h-3 w-3" />
                En curso
              </Badge>
            )}
          </div>
          <CardDescription>{category.schedule.frequency}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center text-center p-4 rounded-lg bg-primary/5">
            <p className="text-3xl font-bold text-primary">S/ {category.price.toFixed(2)}</p>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
            {/* Professors */}
            <div className="flex items-start gap-2">
              <GraduationCap className="h-4 w-4 mt-0.5 shrink-0"/>
              <span>
                {categoryProfessors.length > 0
                  ? categoryProfessors.map(p => p.name).join(', ')
                  : category.professors.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0"/>
                <span>{category.schedule.time}</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0"/>
                <span>{category.enrolledStudents} / {category.maxCapacity} alumnos</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0"/>
                <span>Inicia: {format(new Date(category.startDate), 'dd/MM/yyyy')}</span>
            </div>
             <div className="flex items-start gap-2">
                <Sun className="h-4 w-4 shrink-0 mt-0.5"/>
                <span>{category.schedule.days.join(' · ')}</span>
            </div>
        </div>
      </CardContent>
       <CardFooter className="flex justify-end gap-2">
            <Button onClick={() => onView(category)}>Ver Detalles</Button>
      </CardFooter>
    </Card>
  );
}
