import { Button } from '@/components/ui/button';
import type { Professor } from '@/lib/types';
import { Edit, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProfessorListProps = {
  professors: Professor[];
  onAddProfessor: () => void;
  onEditProfessor: (professor: Professor) => void;
};

export default function ProfessorList({ professors, onAddProfessor, onEditProfessor }: ProfessorListProps) {
  return (
    <Card>
        <CardHeader>
             <div className="flex items-center justify-between">
                <CardTitle>Profesores</CardTitle>
                <Button variant="ghost" size="sm" onClick={onAddProfessor}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {professors.map((prof) => (
                <div key={prof.id} className="flex items-center group">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://picsum.photos/seed/${prof.id}/100/100`} />
                        <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{prof.name}</p>
                        <p className="text-sm text-muted-foreground">{prof.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => onEditProfessor(prof)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
  );
}
