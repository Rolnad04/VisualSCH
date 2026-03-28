'use client';
import { useState, useMemo } from 'react';
import type { Student } from '@/lib/types';
import AlumnosFilterBar from './alumnos-filter-bar';
import AlumnosTable from './alumnos-table';
import AlumnoViewSheet from './alumnos-view-sheet';
import { Button } from '@/components/ui/button';
import AnunciosDialog from './anuncios-dialog';
import NotificacionesDeudaDialog from './notificaciones-deuda-dialog';

type AlumnosClientProps = {
  initialStudents: Student[];
};

export default function AlumnosClient({ initialStudents }: AlumnosClientProps) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    paymentStatus: 'all',
    season: 'all',
    sport: 'all',
    ageOperator: 'all',
    age: '',
    ageEnd: '',
  });
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [anunciosOpen, setAnunciosOpen] = useState(false);
  const [notificacionesOpen, setNotificacionesOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    return initialStudents.filter(student => {
      if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase()) && !student.dni.includes(filters.search)) return false;
      if (filters.category !== 'all' && student.category !== filters.category) return false;
      if (filters.paymentStatus !== 'all' && student.paymentStatus !== filters.paymentStatus) return false;
      if (filters.season !== 'all' && student.season !== filters.season) return false;
      if (filters.sport !== 'all' && student.sport !== filters.sport) return false;

      if(filters.age && filters.ageOperator !== 'all') {
        const age = parseInt(filters.age, 10);
        if(!isNaN(age)) {
          if (filters.ageOperator === 'eq' && student.age !== age) return false;
          if (filters.ageOperator === 'lt' && student.age >= age) return false;
          if (filters.ageOperator === 'gt' && student.age <= age) return false;
          if (filters.ageOperator === 'btw') {
            const ageEnd = parseInt(filters.ageEnd, 10);
            if(!isNaN(ageEnd) && (student.age < age || student.age > ageEnd)) return false;
          }
        }
      }

      return true;
    });
  }, [initialStudents, filters]);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewSheetOpen(true);
  };
  
  const handleClearFilters = () => {
    setFilters({
        search: '',
        category: 'all',
        paymentStatus: 'all',
        season: 'all',
        sport: 'all',
        ageOperator: 'all',
        age: '',
        ageEnd: ''
    });
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-bold font-headline">Alumnos</h1>
                <p className="text-muted-foreground">Consulta la información de todos los alumnos.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAnunciosOpen(true)}>Anuncios</Button>
                <Button variant="outline" onClick={() => setNotificacionesOpen(true)}>Notificaciones de Deuda</Button>
            </div>
        </div>
        <AlumnosFilterBar filters={filters} setFilters={setFilters} onClear={handleClearFilters} />
        <AlumnosTable
          students={filteredStudents}
          onViewStudent={handleViewStudent}
        />
      </div>
      <AlumnoViewSheet
        open={isViewSheetOpen}
        onOpenChange={setViewSheetOpen}
        student={selectedStudent}
      />
      <AnunciosDialog open={anunciosOpen} onOpenChange={setAnunciosOpen} students={filteredStudents} />
      <NotificacionesDeudaDialog open={notificacionesOpen} onOpenChange={setNotificacionesOpen} students={filteredStudents} />
    </>
  );
}
