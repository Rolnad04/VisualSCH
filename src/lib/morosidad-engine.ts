import { Student } from './types';

export const MorosidadEngine = {
  /**
   * Emulación de Hilo Secundario (Web API / Event Loop).
   * Procesa las deudas de forma asíncrona sin bloquear la UI.
   * Aplica la regla de los 14 días de tolerancia.
   */
  procesarDeudasAsync: async (estudiantes: Student[]): Promise<Student[]> => {
    // Emulamos el envío de la tarea a un hilo secundario (Web API / Event Loop)
    return new Promise((resolve) => {
      setTimeout(() => {
        const fechaActual = new Date();

        // Emulación de LINQ: .Select() -> .map()
        const alumnosActualizados = estudiantes.map(estudiante => {
          if (!estudiante.dueDate) return estudiante;

          const fechaVencimiento = new Date(estudiante.dueDate);
          const diferenciaMilisegundos = fechaActual.getTime() - fechaVencimiento.getTime();
          const diasRetraso = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

          // Regla de los 14 días
          if (diasRetraso > 14) {
            return {
              ...estudiante,
              paymentStatus: 'Deuda pendiente' as const,
              isActive: false,
            };
          } else if (diasRetraso > 0 && diasRetraso <= 14) {
            return {
              ...estudiante,
              paymentStatus: 'Próximo a vencer' as const,
            };
          }

          return estudiante;
        });

        // Emulación de LINQ: .Aggregate() -> .reduce()
        const totalMorosos = alumnosActualizados.reduce((acc, est) =>
          est.paymentStatus === 'Deuda pendiente' ? acc + 1 : acc
        , 0);

        const totalProximosAVencer = alumnosActualizados.reduce((acc, est) =>
          est.paymentStatus === 'Próximo a vencer' ? acc + 1 : acc
        , 0);

        console.log(`[Motor] Hilo finalizado. Morosos: ${totalMorosos}, Próximos a vencer: ${totalProximosAVencer}`);
        resolve(alumnosActualizados);
      }, 2500); // Simulamos 2.5 segundos de cálculo pesado
    });
  },

  /**
   * Emulación de LINQ .Where() -> .filter()
   * Filtra solo los estudiantes con deuda pendiente.
   */
  obtenerMorosos: (estudiantes: Student[]): Student[] => {
    return estudiantes.filter(est => est.paymentStatus === 'Deuda pendiente');
  },

  /**
   * Emulación de LINQ .Aggregate() -> .reduce()
   * Calcula el monto total adeudado por todos los morosos.
   */
  calcularDeudaTotal: (estudiantes: Student[]): number => {
    return estudiantes
      .filter(est => est.paymentStatus === 'Deuda pendiente')
      .reduce((total, est) => total + (est.debtAmount || 0), 0);
  },
};
