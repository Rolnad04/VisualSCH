import { Student } from "./types";

export const StudentService = {
  openPaymentControl: (studentId: string) => {
    console.log("Abriendo pagos de", studentId);
    /* Lógica futura */
  },
  viewHistory: (studentId: string) => {
    console.log("Cargando historial de", studentId);
  },
  registerAttendance: (studentId: string) => {
    console.log("Registrando asistencia para", studentId);
  },
  generateCarnet: (student: Student) => {
    window.print(); /* Simula impresión del carnet */
  },
  toggleStatus: async (studentId: string, currentStatus: boolean | undefined) => {
    await new Promise(res => setTimeout(res, 800)); // Simula Hilo/Latencia
    console.log("Estado cambiado a", !currentStatus);
    return !currentStatus;
  }
};
