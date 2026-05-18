'use client';
import { useState, useMemo, useEffect } from 'react';
import type { Student } from '@/lib/types';
import AlumnosFilterBar from './alumnos-filter-bar';
import AlumnosTable from './alumnos-table';
import AlumnoViewSheet from './alumnos-view-sheet';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import AnunciosDialog from './anuncios-dialog';
import NotificacionesDeudaDialog from './notificaciones-deuda-dialog';
import { MorosidadEngine } from '@/lib/morosidad-engine';
import { useToast } from '@/hooks/use-toast';

type AlumnosClientProps = {
  initialStudents: Student[];
};

export default function AlumnosClient({ initialStudents }: AlumnosClientProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    paymentStatus: 'all',
    season: 'all',
    sport: 'all',
    ageOperator: 'all',
    age: '',
    ageEnd: '',
    isActive: 'all',
  });
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [anunciosOpen, setAnunciosOpen] = useState(false);
  const [notificacionesOpen, setNotificacionesOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase()) && !student.dni.includes(filters.search)) return false;
      if (filters.category !== 'all' && student.category !== filters.category) return false;
      if (filters.paymentStatus !== 'all' && student.paymentStatus !== filters.paymentStatus) return false;
      if (filters.season !== 'all' && student.season !== filters.season) return false;
      if (filters.sport !== 'all' && student.sport !== filters.sport) return false;

      // ── Filtro de Estado de Actividad (Soft Delete) ─────────────
      if (filters.isActive === 'active' && student.isActive === false) return false;
      if (filters.isActive === 'inactive' && student.isActive !== false) return false;

      if(filters.age && filters.ageOperator !== 'all') {
        const age = parseInt(filters.age, 10);
        if(!isNaN(age)) {
          if (filters.ageOperator === 'eq' && student.age !== age) return false;
          if (filters.ageOperator === 'lt' && student.age >= age) return false;
          if (filters.ageOperator === 'gt' && student.age <= age) return false;
          if (filters.ageOperator === 'btw') {
            const ageEnd = parseInt(filters.ageEnd, 10);
            if(!isNaN(ageEnd) && (student.age < age || student.age > ageEnd)) return false;
          }
        }
      }

      return true;
    });
  }, [students, filters]);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewSheetOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // 1. Guardamos el estado previo por si necesitamos hacer Rollback
    const previousStudents = [...students];
    const previousSelected = selectedStudent;

    // 2. Actualización Optimista: Cambiamos la UI de inmediato sin esperar al servidor
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
    setSelectedStudent(prev =>
      prev && prev.id === id ? { ...prev, isActive: !currentStatus } : prev
    );

    try {
      // 3. Simulamos la petición al servidor con un 40% de probabilidad de fallo (para pruebas de red)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.6 ? reject(new Error("Error de conexión")) : resolve("OK");
        }, 1000);
      });
      // Si sale bien, no hacemos nada más, la UI ya está actualizada.
    } catch (error) {
      // 4. ROLLBACK: Si la red falla, revertimos al estado anterior y mostramos alerta
      console.error("Fallo en la transacción, ejecutando Rollback...");
      setStudents(previousStudents);
      setSelectedStudent(previousSelected);
      alert("Error de red: No se pudo actualizar el estado. Se ha revertido la acción (Rollback).");
      throw error; // Re-lanzar para que el Sheet sepa que falló
    }
  };

  const handleUpdateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    // Mantener sincronizado el estudiante seleccionado
    setSelectedStudent(prev =>
      prev && prev.id === id ? { ...prev, ...updatedData } : prev
    );
  };
  
  const handleClearFilters = () => {
    setFilters({
        search: '',
        category: 'all',
        paymentStatus: 'all',
        season: 'all',
        sport: 'all',
        ageOperator: 'all',
        age: '',
        ageEnd: '',
        isActive: 'all',
    });
  }

  // ── Motor de Morosidad (Hilo Secundario / Async) ──────────────────────
  const ejecutarBarridoMorosidad = async () => {
    setIsProcessing(true);
    toast({
      title: 'Procesando en segundo plano...',
      description: 'Calculando tolerancias de 14 días. Puedes seguir navegando.',
    });

    // Se delega al "hilo secundario", la UI NO se congela.
    const resultado = await MorosidadEngine.procesarDeudasAsync(students);

    setStudents(resultado); // Actualizamos el estado global
    setIsProcessing(false);
    toast({
      title: 'Cálculo Finalizado',
      description: 'El estado de morosidad ha sido actualizado.',
    });
  };

  // ── Control Timer (Emulación de Timer de .NET) ─────────────────────────
  useEffect(() => {
    console.log("⏱️ [Control Timer Activo]: Configurando verificación automática de morosidad cada 60 segundos...");

    const autoTimer = setInterval(async () => {
      console.log("🔄 [Timer Trigger]: Iniciando barrido automático diario de cuentas morosas en segundo plano...");

      // Ejecuta el cálculo asíncrono de manera silenciosa
      const resultado = await MorosidadEngine.procesarDeudasAsync(students);
      setStudents(resultado);

      console.log("✅ [Timer Completado]: El motor automático actualizó las deudas pendientes de forma exitosa.");
    }, 60000); // 60 segundos para fines de prueba (en producción sería cada 24 horas)

    // Cleanup: Destruye el timer si el usuario sale del módulo
    return () => {
      console.log("🛑 [Control Timer Desactivado]: Limpiando temporizador de memoria.");
      clearInterval(autoTimer);
    };
  }, [students]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-bold font-headline">Alumnos</h1>
                <p className="text-muted-foreground">Consulta la información de todos los alumnos.</p>
            </div>
            <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={ejecutarBarridoMorosidad}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  {isProcessing ? 'Procesando...' : 'Motor de Morosidad'}
                </Button>
                <Button variant="outline" onClick={() => setAnunciosOpen(true)}>Anuncios</Button>
                <Button variant="outline" onClick={() => setNotificacionesOpen(true)}>Notificaciones de Deuda</Button>
            </div>
        </div>
        <AlumnosFilterBar filters={filters} setFilters={setFilters} onClear={handleClearFilters} />
        <AlumnosTable
          students={filteredStudents}
          onViewStudent={handleViewStudent}
        />
      </div>
      <AlumnoViewSheet
        open={isViewSheetOpen}
        onOpenChange={setViewSheetOpen}
        student={selectedStudent}
        onToggleStatus={handleToggleStatus}
        onUpdateStudent={handleUpdateStudent}
      />
      <AnunciosDialog open={anunciosOpen} onOpenChange={setAnunciosOpen} students={filteredStudents} />
      <NotificacionesDeudaDialog open={notificacionesOpen} onOpenChange={setNotificacionesOpen} students={filteredStudents} />
    </>
  );
}
