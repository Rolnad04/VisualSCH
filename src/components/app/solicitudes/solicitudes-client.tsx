'use client';
import { useState, useMemo } from 'react';
import { ConfirmationRequest, RequestStatus } from '@/lib/types';
import FilterBar from './filter-bar';
import RequestsList from './requests-list';
import { DateRange } from 'react-day-picker';
import { users } from '@/lib/data';

type SolicitudesClientProps = {
  initialRequests: ConfirmationRequest[];
  initialStatus?: RequestStatus;
};

export default function SolicitudesClient({ initialRequests, initialStatus }: SolicitudesClientProps) {
  const [status, setStatus] = useState<string>(initialStatus || 'all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [promoter, setPromoter] = useState<string>('all');
  const [motive, setMotive] = useState<string>('all');
  
  const promoters = ['all', ...users.filter(u => u.role === 'Promotora').map(p => p.name)];
  const motives = ['all', 'Inscripción/Mensualidad', 'Mensualidad', 'Deuda', 'Uniforme', 'Pack 1'];


  const filteredRequests = useMemo(() => {
    let requests = [...initialRequests];

    if (status !== 'all') {
      requests = requests.filter(req => req.status === status);
    }
    
    if (promoter !== 'all') {
      requests = requests.filter(req => req.promoterName === promoter);
    }
    
    if (motive !== 'all') {
      requests = requests.filter(req => req.motive === motive);
    }

    if (dateRange?.from) {
      requests = requests.filter(req => {
        const reqDate = new Date(req.timestamp);
        if (dateRange.to) {
          return reqDate >= dateRange.from! && reqDate <= dateRange.to!;
        }
        // If only from is selected, filter for that day
        return reqDate.toDateString() === dateRange.from!.toDateString();
      });
    }

    return requests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [initialRequests, status, promoter, motive, dateRange]);
  
  const handleFilter = () => {
    // The filtering is already done by useMemo, this function is for the button's onClick
    console.log("Filtering with:", { status, promoter, motive, dateRange });
  };
  
  const handleClearFilters = () => {
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
      <RequestsList requests={filteredRequests} />
    </div>
  );
}
