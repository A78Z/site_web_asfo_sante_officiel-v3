import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, Heart, FileText, Users, Building2, Handshake, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const asfoSubLinks = [
  {
    to: '/about/mission',
    title: 'Mission',
    description: 'Nos objectifs et notre vision pour la santé.',
    icon: FileText,
  },
  {
    to: '/about/historique',
    title: 'Historique',
    description: "L'histoire de la création de l'ASFO.",
    icon: Info,
  },
  {
    to: '/about/organisation',
    title: 'Organisation',
    description: 'Notre structure et notre fonctionnement.',
    icon: Building2,
  },
  {
    to: '/about/partenaires',
    title: 'Partenaires',
    description: 'Les institutions qui nous accompagnent.',
    icon: Handshake,
  },
];

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/archives', label: 'Archives' },
  { to: '/gallery', label: 'Médiathèque' },
  { to: '/news', label: 'Actualités' },
  { to: '/contact', label: 'Contact' },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isAsfoActive = ['/about', '/about/mission', '/about/historique', '/about/organisation', '/about/partenaires'].some(
    (p) => location.pathname === p
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200/80'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 xl:px-10">
        {/* ─── Logo ─── */}
        <Link
          to="/"
          className="flex items-center transition-transform duration-200 hover:scale-105"
        >
          <img
            src="/logo.png"
            alt="ASFO Logo"
            className="h-14 w-14 rounded-full object-contain"
          />
        </Link>

        {/* ─── Desktop Navigation ─── */}
        <nav className="hidden lg:flex items-center gap-10 uppercase tracking-wider">
          <NavLink to="/" active={isActive('/')}>
            Accueil
          </NavLink>

          {/* ASFO dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`
                    bg-transparent px-0 py-0 h-auto text-[13px] font-medium uppercase tracking-wider
                    hover:bg-transparent focus:bg-transparent
                    data-[state=open]:bg-transparent
                    transition-colors duration-200
                    ${isAsfoActive ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'}
                  `}
                >
                  ASFO
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid w-[520px] grid-cols-[200px_1fr] gap-0 p-0 rounded-xl overflow-hidden">
                    {/* Featured card */}
                    <NavigationMenuLink asChild>
                      <Link
                        to="/about"
                        className="flex flex-col justify-end bg-gradient-to-br from-teal-500 to-teal-700 p-6 text-white no-underline transition-all hover:from-teal-600 hover:to-teal-800"
                      >
                        <img
                          src="/logo.png"
                          alt="ASFO"
                          className="mb-4 h-10 w-10 rounded-full bg-white/20 p-1"
                        />
                        <p className="text-base font-semibold leading-tight">
                          Découvrir ASFO
                        </p>
                        <p className="mt-1.5 text-sm leading-snug text-teal-100">
                          Action Sanitaire pour le Fouta
                        </p>
                      </Link>
                    </NavigationMenuLink>

                    {/* Sub-links */}
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {asfoSubLinks.map((item) => (
                        <DropdownLink key={item.to} {...item} />
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {navLinks.slice(1).map((link) => (
            <NavLink key={link.to} to={link.to} active={isActive(link.to)}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ─── Desktop Actions ─── */}
        <div className="hidden lg:flex items-center gap-3 uppercase tracking-wider">
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-teal-500/60 text-teal-600 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 font-medium text-[13px] transition-all duration-200"
          >
            <Link to="/candidature">Candidature</Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium text-[13px] shadow-sm transition-all duration-200"
          >
            <Link to="/donate">
              <Heart className="mr-1 h-3.5 w-3.5" />
              Don
            </Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-[13px] shadow-sm transition-all duration-200"
          >
            <Link to="/member-card">
              <Users className="mr-1 h-3.5 w-3.5" />
              Soutenir
            </Link>
          </Button>
        </div>

        {/* ─── Mobile Hamburger ─── */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className="h-10 w-10 text-gray-700 hover:bg-gray-100 hover:text-teal-600"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] border-l border-gray-100 bg-white flex flex-col p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>

              {/* Mobile header */}
              <div className="flex items-center border-b border-gray-100 px-6 py-4">
                <img
                  src="/logo.png"
                  alt="ASFO Logo"
                  className="h-12 w-12 rounded-full object-contain"
                />
              </div>

              {/* Mobile nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="flex flex-col gap-1 uppercase tracking-wider">
                  <MobileLink
                    to="/"
                    active={isActive('/')}
                    onClick={() => setMobileOpen(false)}
                  >
                    Accueil
                  </MobileLink>

                  {/* ASFO section */}
                  <div className="mt-4 mb-2">
                    <span className="px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                      ASFO
                    </span>
                  </div>
                  <div className="ml-2 flex flex-col gap-0.5 border-l-2 border-teal-100 pl-3">
                    <MobileLink
                      to="/about"
                      active={isActive('/about')}
                      onClick={() => setMobileOpen(false)}
                    >
                      Découvrir
                    </MobileLink>
                    {asfoSubLinks.map((item) => (
                      <MobileLink
                        key={item.to}
                        to={item.to}
                        active={isActive(item.to)}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.title}
                      </MobileLink>
                    ))}
                  </div>

                  <div className="my-4 h-px bg-gray-100" />

                  {navLinks.slice(1).map((link) => (
                    <MobileLink
                      key={link.to}
                      to={link.to}
                      active={isActive(link.to)}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </MobileLink>
                  ))}
                </div>

                {/* Mobile actions */}
                <div className="mt-8 flex flex-col gap-2.5 uppercase tracking-wider">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-center h-11 rounded-lg border-teal-500/60 text-teal-600 hover:bg-teal-50 text-[13px] font-medium"
                  >
                    <Link to="/candidature" onClick={() => setMobileOpen(false)}>
                      Candidature
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-center h-11 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium"
                  >
                    <Link to="/donate" onClick={() => setMobileOpen(false)}>
                      <Heart className="mr-1.5 h-4 w-4" />
                      Faire un don
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-center h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium"
                  >
                    <Link to="/member-card" onClick={() => setMobileOpen(false)}>
                      <Users className="mr-1.5 h-4 w-4" />
                      Soutenir l'ASFO
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

/* ─── Desktop nav link ─── */
function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`group relative text-[13px] font-medium transition-colors duration-200 ${
        active ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-[1.6rem] left-0 h-[2px] rounded-full bg-teal-500 transition-all duration-300 ${
          active ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}

/* ─── Dropdown sub-link inside ASFO menu ─── */
function DropdownLink({
  to,
  title,
  description,
  icon: Icon,
}: {
  to: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={to}
        className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-teal-50/60"
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700">
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500 line-clamp-2">
            {description}
          </p>
        </div>
        <ChevronRight className="ml-auto mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-teal-500" />
      </Link>
    </NavigationMenuLink>
  );
}

/* ─── Mobile nav link ─── */
function MobileLink({
  to,
  active,
  onClick,
  children,
}: {
  to: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
        active
          ? 'bg-teal-50 text-teal-700'
          : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
      }`}
    >
      {children}
    </Link>
  );
}

export default Header;
