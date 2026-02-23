import Link from 'next/link';
import {
  ArrowUpRight,
  Users,
  CalendarCheck,
  AlertCircle,
  Clock,
  UserPlus,
  DollarSign,
  Activity,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { students, requests, professors } from '@/lib/data';

const activeStudents = students.length;
const pendingRequests = requests.filter(r => r.status === 'Pendiente').length;
const todayAttendance = 75; // Mock data

const newStudents = students.slice(0, 3);
const pendingDebts = students.filter(s => s.paymentStatus === 'Deuda pendiente').slice(0, 3);
const recentActivity = requests.slice(0, 4);

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alumnos Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudents}</div>
              <p className="text-xs text-muted-foreground">+5 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Hoy</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAttendance}%</div>
              <p className="text-xs text-muted-foreground">+10% desde ayer</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{pendingRequests}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/solicitudes?status=Pendiente" className="underline">Ver solicitudes</Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turno Actual</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-sm font-bold">Cat 12: {professors[1].name}</div>
                <p className="text-xs text-muted-foreground">10:00am a 12:00pm</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2 grid auto-rows-max gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                 <div className="grid gap-2">
                    <CardTitle>Alumnos Recién Inscritos</CardTitle>
                    <CardDescription>
                      Estos son los últimos alumnos que se han unido al club.
                    </CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/alumnos">
                      Ver todos
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alumno</TableHead>
                      <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                      <TableHead className="text-right">Edad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newStudents.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={student.photoUrl} alt="Avatar" />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{student.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{student.category}</TableCell>
                          <TableCell className="text-right">{student.age} años</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Deudas Pendientes</CardTitle>
                <CardDescription>
                  Alumnos con pagos de mensualidad vencidos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alumno</TableHead>
                      <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                       <TableHead className="hidden sm:table-cell text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDebts.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={student.photoUrl} alt="Avatar" />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{student.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{student.category}</TableCell>
                          <TableCell className="hidden sm:table-cell text-right">S/ 30.00</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
                {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={`https://picsum.photos/seed/${activity.promoterName}/100/100`} alt="Avatar" />
                        <AvatarFallback>{activity.promoterName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                           {activity.promoterName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {`Solicitud de ${activity.motive.toLowerCase()} para ${activity.student.name}`}
                        </p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
