'use client';
import { useState, useMemo, useCallback } from 'react';
import { ConfirmationRequest, RequestStatus, Student } from '@/lib/types';
import FilterBar from './filter-bar';
import RequestsList from './requests-list';
import { DateRange } from 'react-day-picker';
import { users, requests as requestsData, students as studentsData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type SolicitudesClientProps = {
  initialRequests: ConfirmationRequest[];
  initialStatus?: RequestStatus;
};

export default function SolicitudesClient({ initialRequests, initialStatus }: SolicitudesClientProps) {
  const { toast } = useToast();

  // ── Estado local: NUNCA mutar las constantes importadas directamente ──
  const [localRequests, setLocalRequests] = useState<ConfirmationRequest[]>(initialRequests);
  const [localStudents, setLocalStudents] = useState<Student[]>(studentsData);

  const [status, setStatus] = useState<string>(initialStatus || 'all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [promoter, setPromoter] = useState<string>('all');
  const [motive, setMotive] = useState<string>('all');
  
  const promoters = ['all', ...users.filter(u => u.role === 'Promotora').map(p => p.name)];
  const motives = ['all', 'Inscripción/Mensualidad', 'Mensualidad', 'Deuda', 'Uniforme', 'Pack 1'];


  const filteredRequests = useMemo(() => {
    let filtered = [...localRequests];

    if (status !== 'all') {
      filtered = filtered.filter(req => req.status === status);
    }
    
    if (promoter !== 'all') {
      filtered = filtered.filter(req => req.promoterName === promoter);
    }
    
    if (motive !== 'all') {
      filtered = filtered.filter(req => req.motive === motive);
    }

    if (dateRange?.from) {
      filtered = filtered.filter(req => {
        const reqDate = new Date(req.timestamp);
        if (dateRange.to) {
          return reqDate >= dateRange.from! && reqDate <= dateRange.to!;
        }
        // If only from is selected, filter for that day
        return reqDate.toDateString() === dateRange.from!.toDateString();
      });
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [localRequests, status, promoter, motive, dateRange]);

  // ── Lógica transaccional: Aprobar solicitud ──────────────────────────
  const handleApprove = useCallback((requestId: string): void => {
    // 1. Encontrar la solicitud
    const targetRequest = localRequests.find((req) => req.id === requestId);
    if (!targetRequest || targetRequest.status !== 'Pendiente') return;

    const paymentAmount = targetRequest.payment.amount;
    const studentName = targetRequest.student.name;

    // 2. Actualizar el estado de la solicitud a "Confirmado" (inmutable)
    setLocalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'Confirmado' as const,
              confirmationTimestamp: new Date().toISOString(),
            }
          : req
      )
    );

    // 3. Lógica transaccional sobre el estudiante: descontar deuda
    setLocalStudents((prev) =>
      prev.map((student) => {
        if (student.name !== studentName) return student;

        const currentDebt = student.debtAmount ?? 0;
        const newDebt = Math.max(0, currentDebt - paymentAmount);

        const isDebtCleared = newDebt <= 0;

        return {
          ...student,
          debtAmount: newDebt,
          paymentStatus: isDebtCleared ? ('Al día' as const) : student.paymentStatus,
          monthsOwed: isDebtCleared ? 0 : student.monthsOwed,
          totalPayments: student.totalPayments + 1,
        };
      })
    );

    toast({
      title: '✅ Solicitud aprobada',
      description: `Pago de S/ ${paymentAmount.toFixed(2)} aplicado a ${studentName}.`,
    });
  }, [localRequests, toast]);

  const handleFilter = (): void => {
    // The filtering is already done by useMemo, this function is for the button's onClick
    console.log("Filtering with:", { status, promoter, motive, dateRange });
  };
  
  const handleClearFilters = (): void => {
    setStatus(initialStatus || 'all');
    setPromoter('all');
    setMotive('all');
    setDateRange(undefined);
  };

  return (
    <div className="space-y-4">
      <FilterBar
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        promoter={promoter}
        setPromoter={setPromoter}
        promoters={promoters}
        motive={motive}
        setMotive={setMotive}
        motives={motives}
        onFilter={handleFilter}
        onClear={handleClearFilters}
      />
      <RequestsList requests={filteredRequests} onApprove={handleApprove} />
    </div>
  );
}
