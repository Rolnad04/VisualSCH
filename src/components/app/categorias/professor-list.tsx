'use client';
import { useState } from 'react';
import type { Professor, Category } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Mail, Clock, Sun, Pencil, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ProfessorListProps = {
  professors: Professor[];
  categories: Category[];
  userRole?: string | null;
  onUpdateProfessor?: (updated: Professor) => void;
  onAddProfessor?: (newProf: Professor) => void;
};

export default function ProfessorList({ professors, categories, userRole, onUpdateProfessor, onAddProfessor }: ProfessorListProps) {
  const { toast } = useToast();
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    categoryIds: [] as string[],
  });

  // Create form state
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    dni: '',
    phone: '',
    email: '',
    categoryIds: [] as string[],
  });

  const isAdmin = userRole === 'Administrador';

  const getProfessorCategories = (prof: Professor) => {
    return categories.filter(c => prof.categoryIds.includes(c.id));
  };

  // --- Edit handlers ---
  const handleOpenEdit = (prof: Professor, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditForm({
      name: prof.name,
      phone: prof.phone,
      email: prof.email,
      categoryIds: [...prof.categoryIds],
    });
    setEditingProfessor(prof);
  };

  const handleToggleEditCategory = (catId: string) => {
    setEditForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter(id => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  const handleSaveEdit = () => {
    if (!editingProfessor) return;
    const updated: Professor = {
      ...editingProfessor,
      name: editForm.name.trim(),
      phone: editForm.phone,
      email: editForm.email,
      categoryIds: editForm.categoryIds,
    };
    onUpdateProfessor?.(updated);
    setEditingProfessor(null);
    toast({
      title: 'Profesor actualizado',
      description: `Se actualizaron los datos de "${editingProfessor.name}".`,
    });
  };

  // --- Create handlers ---
  const handleResetCreateForm = () => {
    setCreateForm({ name: '', dni: '', phone: '', email: '', categoryIds: [] });
  };

  const handleToggleCreateCategory = (catId: string) => {
    setCreateForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter(id => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  const handleSaveCreate = () => {
    const newProf: Professor = {
      id: `prof-new-${Date.now()}`,
      name: createForm.name.trim(),
      sport: 'Fútbol',
      phone: createForm.phone.trim(),
      email: createForm.email.trim(),
      categoryIds: createForm.categoryIds,
    };
    onAddProfessor?.(newProf);
    setCreateOpen(false);
    handleResetCreateForm();
    toast({
      title: 'Profesor registrado',
      description: `Se registró a "${newProf.name}" correctamente.`,
    });
  };

  const isCreateFormValid =
    createForm.name.trim().length > 0 &&
    createForm.dni.length >= 1 && createForm.dni.length <= 8 &&
    createForm.phone.length >= 1 && createForm.phone.length <= 9 &&
    createForm.email.trim().length > 0;

  return (
    <>
      <Card>
          <CardHeader>
               <div className="flex items-center justify-between">
                  <CardTitle>Profesores</CardTitle>
                  {isAdmin && (
                    <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
                      <PlusCircle className="h-4 w-4" />
                      Agregar Profesor
                    </Button>
                  )}
              </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
              {professors.map((prof) => (
                  <div
                    key={prof.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                      <button
                        className="flex items-center gap-3 flex-1 cursor-pointer text-left"
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
                        <span className="text-xs text-muted-foreground shrink-0">Ver →</span>
                      </button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
                          onClick={(e) => handleOpenEdit(prof, e)}
                          title="Editar profesor"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                  </div>
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

      {/* Professor Edit Dialog — Admin only */}
      <Dialog open={!!editingProfessor} onOpenChange={(open) => !open && setEditingProfessor(null)}>
        <DialogContent className="sm:max-w-md">
          {editingProfessor && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Profesor</DialogTitle>
                <DialogDescription>Modifica los datos de &quot;{editingProfessor.name}&quot;</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-name-${editingProfessor.id}`}>Nombres y Apellidos</Label>
                  <Input
                    id={`edit-name-${editingProfessor.id}`}
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-phone-${editingProfessor.id}`}>Número de celular</Label>
                  <Input
                    id={`edit-phone-${editingProfessor.id}`}
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-email-${editingProfessor.id}`}>Correo electrónico</Label>
                  <Input
                    id={`edit-email-${editingProfessor.id}`}
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categorías asignadas</Label>
                  <div className="grid gap-2 max-h-48 overflow-y-auto rounded-md border p-3">
                    {categories.map(cat => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5"
                      >
                        <Checkbox
                          checked={editForm.categoryIds.includes(cat.id)}
                          onCheckedChange={() => handleToggleEditCategory(cat.id)}
                        />
                        <span>{cat.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{cat.schedule.time}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingProfessor(null)}>Cancelar</Button>
                <Button onClick={handleSaveEdit}>Guardar cambios</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Professor Create Dialog — Admin only */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) { setCreateOpen(false); handleResetCreateForm(); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Profesor</DialogTitle>
            <DialogDescription>Completa los datos del nuevo profesor para la academia.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label htmlFor="create-prof-name">Nombres y Apellidos</Label>
              <Input
                id="create-prof-name"
                type="text"
                placeholder="Ej: Juan Carlos Pérez López"
                value={createForm.name}
                onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-prof-dni">DNI</Label>
              <Input
                id="create-prof-dni"
                type="text"
                inputMode="numeric"
                placeholder="Ej: 12345678"
                maxLength={8}
                value={createForm.dni}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setCreateForm(prev => ({ ...prev, dni: val }));
                }}
              />
              <p className="text-xs text-muted-foreground">{createForm.dni.length}/8 dígitos</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-prof-phone">Celular</Label>
              <Input
                id="create-prof-phone"
                type="tel"
                placeholder="Ej: 987654321"
                maxLength={9}
                value={createForm.phone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setCreateForm(prev => ({ ...prev, phone: val }));
                }}
              />
              <p className="text-xs text-muted-foreground">{createForm.phone.length}/9 dígitos</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-prof-email">Correo Electrónico</Label>
              <Input
                id="create-prof-email"
                type="email"
                placeholder="Ej: profesor@ejemplo.com"
                value={createForm.email}
                onChange={e => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Categorías Asignadas</Label>
              <div className="grid gap-2 max-h-48 overflow-y-auto rounded-md border p-3">
                {categories.map(cat => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5"
                  >
                    <Checkbox
                      checked={createForm.categoryIds.includes(cat.id)}
                      onCheckedChange={() => handleToggleCreateCategory(cat.id)}
                    />
                    <span>{cat.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{cat.schedule.time}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); handleResetCreateForm(); }}>Cancelar</Button>
            <Button onClick={handleSaveCreate} disabled={!isCreateFormValid}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
