import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function InscripcionPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Inscripción de Alumnos</CardTitle>
                <CardDescription>Módulo para registrar nuevas inscripciones.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Aquí irá el formulario para nuevas inscripciones.</p>
            </CardContent>
        </Card>
    );
}
