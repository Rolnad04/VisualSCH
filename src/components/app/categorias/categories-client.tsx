'use client';
import { useState } from 'react';
import type { Category, Professor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CategoryCard from './category-card';
import ProfessorList from './professor-list';
import CategoryFormSheet from './category-form-sheet';
import ProfessorFormDialog from './professor-form-dialog';
import CategoryViewSheet from './category-view-sheet';

type CategoriesClientProps = {
  initialCategories: Category[];
  initialProfessors: Professor[];
};

export function CategoriesClient({ initialCategories, initialProfessors }: CategoriesClientProps) {
  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false);
  const [isProfessorDialogOpen, setProfessorDialogOpen] = useState(false);
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setCategorySheetOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategorySheetOpen(true);
  };
  
  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewSheetOpen(true);
  }

  const handleCreateProfessor = () => {
    setSelectedProfessor(null);
    setProfessorDialogOpen(true);
  };

  const handleEditProfessor = (professor: Professor) => {
    setSelectedProfessor(professor);
    setProfessorDialogOpen(true);
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Categorías</h2>
            <Button onClick={handleCreateCategory}>
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Categoría
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {initialCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onView={handleViewCategory}
              />
            ))}
          </div>
        </div>
        <div>
          <ProfessorList
            professors={initialProfessors}
            onAddProfessor={handleCreateProfessor}
            onEditProfessor={handleEditProfessor}
          />
        </div>
      </div>
      
      <CategoryViewSheet 
        open={isViewSheetOpen}
        onOpenChange={setViewSheetOpen}
        category={selectedCategory}
        onEdit={handleEditCategory}
      />
      
      <CategoryFormSheet
        open={isCategorySheetOpen}
        onOpenChange={setCategorySheetOpen}
        category={selectedCategory}
        allProfessors={initialProfessors}
      />
      <ProfessorFormDialog
        open={isProfessorDialogOpen}
        onOpenChange={setProfessorDialogOpen}
        professor={selectedProfessor}
      />
    </>
  );
}
