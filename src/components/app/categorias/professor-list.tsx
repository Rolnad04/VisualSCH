import type { Professor } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProfessorListProps = {
  professors: Professor[];
};

export default function ProfessorList({ professors }: ProfessorListProps) {
  return (
    <Card>
        <CardHeader>
             <div className="flex items-center justify-between">
                <CardTitle>Profesores</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {professors.map((prof) => (
                <div key={prof.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://picsum.photos/seed/${prof.id}/100/100`} />
                        <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{prof.name}</p>
                        <p className="text-sm text-muted-foreground">{prof.email}</p>
                    </div>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
  );
}
