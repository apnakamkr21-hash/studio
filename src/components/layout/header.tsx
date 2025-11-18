'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Ticket,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  PanelLeft,
  LogIn
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tickets', label: 'My Tickets', icon: Ticket },
  { href: '/recommendations', label: 'For You', icon: Sparkles },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function Header() {
  const userAvatar = PlaceHolderImages['user-avatar'];
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);


  const NavLinks = ({
    className,
    isMobile = false,
  }: {
    className?: string;
    isMobile?: boolean;
  }) => (
    <nav
      className={cn(
        'flex items-center gap-1 text-sm font-medium',
        isMobile ? 'flex-col items-start gap-2' : 'hidden md:flex',
        className
      )}
    >
      {menuItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({
              variant: pathname === item.href ? 'default' : 'ghost',
              size: 'sm',
            }),
            'justify-start',
            isMobile && 'w-full'
          )}
        >
          <item.icon className="h-4 w-4 " />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base font-headline text-primary"
      >
        <ShieldCheck className="h-6 w-6" />
        <span className="sr-only">Campus Events</span>
      </Link>

      <div className="hidden md:flex md:flex-1 md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="mr-4 flex items-center gap-2 text-lg font-semibold font-headline text-primary"
        >
          <span className="">Campus Events</span>
        </Link>
        <NavLinks />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <Link
            href="/"
            className="mb-4 flex items-center gap-2 text-lg font-semibold font-headline text-primary"
          >
            <ShieldCheck className="h-6 w-6" />
            <span>Campus Events</span>
          </Link>
          <NavLinks isMobile />
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage
                  src={user.photoURL || userAvatar.imageUrl}
                  data-ai-hint={userAvatar.imageHint}
                  alt="User avatar"
                />
                <AvatarFallback>{user.isAnonymous ? 'A' : user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut(auth)}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
           <Button variant="outline" size="sm" onClick={() => initiateAnonymousSignIn(auth)}>
             <LogIn className="mr-2 h-4 w-4" />
             Sign In
           </Button>
        )}
      </div>
    </header>
  );
}
