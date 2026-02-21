'use client';
import { useState, useMemo } from 'react';
import type { Student } from '@/lib/types';
import AlumnosFilterBar from './alumnos-filter-bar';
import AlumnosTable from './alumnos-table';
import AlumnoViewSheet from './alumnos-view-sheet';

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

  const handleEditStudent = (student: Student) => {
    // Logic to open edit modal/sheet would go here
    console.log('Editing student:', student.name);
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
      <AlumnosFilterBar filters={filters} setFilters={setFilters} onClear={handleClearFilters} />
      <AlumnosTable
        students={filteredStudents}
        onViewStudent={handleViewStudent}
        onEditStudent={handleEditStudent}
      />
      <AlumnoViewSheet
        open={isViewSheetOpen}
        onOpenChange={setViewSheetOpen}
        student={selectedStudent}
      />
    </>
  );
}
