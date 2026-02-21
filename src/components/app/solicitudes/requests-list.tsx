'use client';
import { ConfirmationRequest } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import RequestItem from './request-item';
import { useMemo } from 'react';

type RequestsListProps = {
  requests: ConfirmationRequest[];
};

export default function RequestsList({ requests }: RequestsListProps) {
  
  const groupedRequests = useMemo(() => {
    return requests.reduce((acc, request) => {
      const date = format(new Date(request.timestamp), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(request);
      return acc;
    }, {} as Record<string, ConfirmationRequest[]>);
  }, [requests]);

  const sortedDates = Object.keys(groupedRequests).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (requests.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No se encontraron solicitudes con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date}>
          <h3 className="text-lg font-semibold mb-2 capitalize">
            {format(new Date(date), "eeee, dd 'de' MMMM", { locale: es })}
          </h3>
          <div className="border rounded-lg">
            {groupedRequests[date].map((request, index) => (
              <RequestItem key={request.id} request={request} isLast={index === groupedRequests[date].length - 1} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
