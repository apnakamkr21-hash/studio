'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  Ticket,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { Header } from './header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Home', icon: Home, tooltip: 'Home' },
    {
      href: '/tickets',
      label: 'My Tickets',
      icon: Ticket,
      tooltip: 'My Tickets',
    },
    {
      href: '/recommendations',
      label: 'For You',
      icon: Sparkles,
      tooltip: 'Recommendations',
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      tooltip: 'Organizer Dashboard',
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold font-headline text-primary">
              Campus Events
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.tooltip}
                  asChild
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
