import { CategoriesClient } from '@/components/app/categorias/categories-client';
import { categories, professors as allProfessors } from '@/lib/data';

export default function CategoriasPage() {
  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold font-headline">Gestión de Categorías y Profesores</h1>
          <p className="text-muted-foreground">Administra las categorías de alumnos y el personal docente.</p>
        </div>
      <CategoriesClient initialCategories={categories} initialProfessors={allProfessors} />
    </div>
  );
}
