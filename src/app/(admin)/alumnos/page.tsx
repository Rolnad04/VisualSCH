import { students } from "@/lib/data";
import AlumnosClient from "@/components/app/alumnos/alumnos-client";

export default function AlumnosPage() {
    return (
        <AlumnosClient initialStudents={students} />
    )
}
