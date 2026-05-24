import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { Student } from './types';

export const MorosidadEngine = {
  procesarDeudasAsync: async (estudiantes: Student[]): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Auditoría anclada al 06/05/2026
        const fechaActual = startOfDay(new Date('2026-05-06T12:00:00'));

        const alumnosActualizados: Student[] = estudiantes.map((estudiante): Student => {
          const resultado: Student = { ...estudiante };

          if (!resultado.dueDate) {
            const esRealmenteMoroso = (resultado.monthsOwed || 0) > 0;
            resultado.paymentStatus = esRealmenteMoroso ? 'Inactivo' : 'Al día';
            resultado.isActive = !esRealmenteMoroso;
            return resultado;
          }

          // date-fns: parseISO interpreta la cadena ISO sin ambigüedad de zona horaria;
          // startOfDay normaliza a medianoche local; differenceInDays evita off-by-one por DST.
          const fechaVencimiento = startOfDay(parseISO(resultado.dueDate));

          const diasRetraso = differenceInDays(fechaActual, fechaVencimiento);

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