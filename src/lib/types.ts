export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Administrador' | 'Promotora';
};

export type Guardian = {
  name: string;
  dni: string;
  phone: string;
};

export type Student = {
  id: string;
  name: string;
  dni: string;
  photoUrl: string;
  age: number;
  gender: 'Masculino' | 'Femenino';
  phone?: string;
  guardian?: Guardian;
  sport: string;
  category: string;
  season: string;
  paymentStatus: 'Al día' | 'Deuda pendiente' | 'Próximo a vencer';
  professorId: string;
  totalPayments: number;
  totalAttendance: number;
};

export type Professor = {
  id: string;
  name: string;
  sport: string;
  phone: string;
  email: string;
  categoryIds: string[];
};

export type Category = {
  id: string;
  name: string;
  sport: string;
  ageRange: [number, number];
  maxCapacity: number;
  enrolledStudents: number;
  professors: string[];
  schedule: {
    days: string[];
    time: string;
    durationPerClass: string;
    frequency: string;
  };
  price: number;
  startDate: string;
};

export type RequestStatus = 'Pendiente' | 'Confirmado' | 'Rechazado' | 'Observado';

export type PaymentMethod = 'Transferencia' | 'Yape' | 'Efectivo';

export type RequestMotive = 'Inscripción/Mensualidad' | 'Mensualidad' | 'Deuda' | 'Uniforme' | 'Pack 1';

export type ConfirmationRequest = {
  id: string;
  timestamp: string;
  motive: RequestMotive;
  promoterName: string;
  status: RequestStatus;
  student: {
    name: string;
    isMinor: boolean;
    guardianName?: string;
    guardianPhone?: string;
    studentPhone?: string;
    sport: string;
    category: string;
    schedule: string;
    professor: string;
  };
  payment: {
    evidencePhotoUrl?: string;
    evidenceTimestamp?: string;
    method: PaymentMethod;
    payerName: string;
    amount: number;
  };
  promoterNotes?: string;
  observation?: {
    notes: string;
    timestamp: string;
    adminEvidencePhotoUrl?: string;
    adminEvidenceTimestamp?: string;
  };
  confirmationTimestamp?: string;
  rejectionTimestamp?: string;
};

export type Season = {
  id: string;
  name: string;
  duration: number; // in days
  studentCount: number;
  price: number;
  startDate: string;
  endDate: string;
  paymentDate: string;
  schedule: string; // e.g., "Lunes-Martes-Miércoles-Jueves"
  benefits: string;
};

export type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type Product = {
  id: string;
  imageUrl: string;
  name: string;
  category: 'Uniforme' | 'Accesorio' | 'Bebida';
  stock: number;
  price: number;
  imageHint?: string;
};

export type Attendance = {
  id: string;
  studentId: string;
  date: string;
  status: 'Presente' | 'Falta';
  promoterId: string;
};
