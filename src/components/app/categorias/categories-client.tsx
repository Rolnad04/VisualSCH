'use client';
import { useState } from 'react';
import type { Category, Professor } from '@/lib/types';
import CategoryCard from './category-card';
import ProfessorList from './professor-list';
import CategoryViewSheet from './category-view-sheet';

type CategoriesClientProps = {
  initialCategories: Category[];
  initialProfessors: Professor[];
};

export function CategoriesClient({ initialCategories, initialProfessors }: CategoriesClientProps) {
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewSheetOpen(true);
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Categorías</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {initialCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onView={handleViewCategory}
              />
            ))}
          </div>
        </div>
        <div>
          <ProfessorList professors={initialProfessors} />
        </div>
      </div>
      
      <CategoryViewSheet 
        open={isViewSheetOpen}
        onOpenChange={setViewSheetOpen}
        category={selectedCategory}
      />
    </>
  );
}
