'use client';
import { useState } from 'react';
import type { Professor, Category } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Clock, Calendar, Sun } from 'lucide-react';

type ProfessorListProps = {
  professors: Professor[];
  categories: Category[];
};

export default function ProfessorList({ professors, categories }: ProfessorListProps) {
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const getProfessorCategories = (prof: Professor) => {
    return categories.filter(c => prof.categoryIds.includes(c.id));
  };

  return (
    <>
      <Card>
          <CardHeader>
               <div className="flex items-center justify-between">
                  <CardTitle>Profesores</CardTitle>
              </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
              {professors.map((prof) => (
                  <button
                    key={prof.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left cursor-pointer"
                    onClick={() => setSelectedProfessor(prof)}
                  >
                      <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://picsum.photos/seed/${prof.id}/100/100`} />
                          <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-0 space-y-0.5 flex-1">
                          <p className="text-sm font-medium leading-none">{prof.name}</p>
                          <p className="text-xs text-muted-foreground">{prof.email}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {getProfessorCategories(prof).map(c => (
                              <Badge key={c.id} variant="outline" className="text-[10px] px-1 py-0">{c.name}</Badge>
                            ))}
                          </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Ver →</span>
                  </button>
              ))}
              </div>
          </CardContent>
      </Card>

      {/* Professor Detail Dialog */}
      <Dialog open={!!selectedProfessor} onOpenChange={(open) => !open && setSelectedProfessor(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedProfessor && (() => {
            const profCategories = getProfessorCategories(selectedProfessor);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://picsum.photos/seed/${selectedProfessor.id}/100/100`} />
                      <AvatarFallback>{selectedProfessor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl">{selectedProfessor.name}</DialogTitle>
                      <DialogDescription>{selectedProfessor.sport}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  {/* Contact */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedProfessor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedProfessor.email}</span>
                    </div>
                  </div>

                  {/* Categories / Schedule */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Categorías y horarios</p>
                    {profCategories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Sin categorías asignadas.</p>
                    ) : (
                      <div className="space-y-2">
                        {profCategories.map(cat => (
                          <div key={cat.id} className="rounded-lg border p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{cat.name}</span>
                              <Badge variant="secondary" className="text-xs">S/ {cat.price.toFixed(2)}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Sun className="h-3 w-3 text-amber-500" />
                                <span>{cat.schedule.days.join(' · ')}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3 text-blue-500" />
                                <span>{cat.schedule.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
}
