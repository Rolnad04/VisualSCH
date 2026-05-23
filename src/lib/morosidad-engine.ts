import { Student } from './types';

export const MorosidadEngine = {
  procesarDeudasAsync: async (estudiantes: Student[]): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Auditoría anclada al 06/05/2026
        const fechaActual = new Date('2026-05-06T12:00:00');
        fechaActual.setHours(0, 0, 0, 0);

        const alumnosActualizados: Student[] = estudiantes.map((estudiante): Student => {
          const resultado: Student = { ...estudiante };

          if (!resultado.dueDate) {
            const esRealmenteMoroso = (resultado.monthsOwed || 0) > 0;
            resultado.paymentStatus = esRealmenteMoroso ? 'Inactivo' : 'Al día';
            resultado.isActive = !esRealmenteMoroso;
            return resultado;
          }

          // SOLUCIÓN: Leer la fecha directamente sin destrozarla
          // Si dueDate es '2026-06-05', esto crea la fecha perfecta
          const fechaVencimiento = new Date(`${resultado.dueDate}T00:00:00`);
          fechaVencimiento.setHours(0, 0, 0, 0);

          const diasRetraso = Math.floor((fechaActual.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24));

          // Asignación de estado según jerarquía
          if (diasRetraso > 14) {
            resultado.paymentStatus = 'Inactivo';
            resultado.isActive = false;
          } else if (diasRetraso > 0 && diasRetraso <= 14) {
            resultado.paymentStatus = 'Deuda pendiente';
            resultado.isActive = true;
          } else if (diasRetraso > -5 && diasRetraso <= 0) {
            resultado.paymentStatus = 'Próximo a vencer';
            resultado.isActive = true;
          } else {
            resultado.paymentStatus = 'Al día';
            resultado.isActive = true;
          }

          return resultado;
        });

        resolve(alumnosActualizados);
      }, 50);
    });
  },
};