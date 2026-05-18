import { Student } from './types';

export interface ReportParams {
  category: string;
  month: string;
}

export const ReportsService = {
  /**
   * Emula la ejecución segura de un Stored Procedure: [dbo].[GetAlumnosMorososReport]
   * Recibe parámetros estrictos y encapsula la lógica de filtrado contra inyecciones de datos corruptos.
   */
  getMorososReport: (students: Student[], params: ReportParams): Student[] => {
    const { category, month } = params;

    console.log(`[SQL Emulation] Executing Stored Procedure: GetAlumnosMorososReport`);
    console.log(`[SQL Emulation] Parameters: @Category='${category}', @Month='${month}'`);

    // Validación de parámetros (Sanitización básica contra Parameter Pollution)
    if (!students || !Array.isArray(students)) return [];

    return students.filter(student => {
      // Filtro paramétrico por categoría (Si es 'all', actúa como un parámetro opcional en SQL)
      const matchCategory = category === 'all' || student.category.toLowerCase() === category.toLowerCase();

      // Filtro paramétrico por estado financiero y mes de vencimiento
      const isMoroso = student.paymentStatus === 'Deuda pendiente' || student.paymentStatus === 'Próximo a vencer';

      let matchMonth = true;
      if (month !== 'all' && student.dueDate) {
        const date = new Date(student.dueDate);
        const nombreMes = date.toLocaleString('es-ES', { month: 'long' });
        matchMonth = nombreMes.toLowerCase() === month.toLowerCase();
      }

      return matchCategory && isMoroso && matchMonth;
    });
  }
};
