'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Home,
  CheckCheck,
  CalendarDays,
  Users,
  Swords,
  Package,
  ListOrdered,
  Warehouse,
  BarChart3,
  Settings,
  FilePenLine,
  ShoppingCart,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const adminNavItems = [
  { href: '/inicio', icon: Home, label: 'Inicio' },
  { href: '/solicitudes', icon: CheckCheck, label: 'Solicitudes' },
  { href: '/temporadas', icon: CalendarDays, label: 'Temporadas' },
  { href: '/categorias', icon: ListOrdered, label: 'Categorías' },
  { href: '/paquetes', icon: Package, label: 'Paquetes' },
  { href: '/alumnos', icon: Users, label: 'Alumnos' },
  { href: '/asistencia', icon: Swords, label: 'Asistencia' },
  { href: '/inventario', icon: Warehouse, label: 'Inventario' },
  { href: '/reportes', icon: BarChart3, label: 'Reportes' },
];

const promoterNavItems = [
  { href: '/inicio', icon: Home, label: 'Inicio' },
  { href: '/inscripcion', icon: FilePenLine, label: 'Inscripción' },
  { href: '/alumnos', icon: Users, label: 'Alumnos' },
  { href: '/asistencia', icon: Swords, label: 'Asistencia' },
  { href: '/categorias', icon: ListOrdered, label: 'Categorías' },
  { href: '/ventas', icon: ShoppingCart, label: 'Ventas' },
  { href: '/deudas', icon: CreditCard, label: 'Cobro de Deudas' },
];


export function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
  }, []);

  const navItems = userRole === 'Promotora' ? promoterNavItems : adminNavItems;
  
  if (!userRole) {
    // Return a minimal sidebar or loading state to avoid layout shift
     return <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex" />;
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/inicio"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image src="/icon.svg" alt="Sporting Club Huaraz Logo" width={32} height={32} />
            <span className="sr-only">Sporting Club Huaraz</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : ''
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
