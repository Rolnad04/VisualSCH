import { students } from "@/lib/data";
import AlumnosClient from "@/components/app/alumnos/alumnos-client";

export default function AlumnosPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Gestión de Alumnos</h1>
                <p className="text-muted-foreground">Busca, filtra y administra la información de todos los alumnos.</p>
            </div>
            <AlumnosClient initialStudents={students} />
        </div>
    )
}
