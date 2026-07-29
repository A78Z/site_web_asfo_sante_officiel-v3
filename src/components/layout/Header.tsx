import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, Heart, CreditCard, ArrowRight } from 'lucide-react';

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
import { megaMenus, MegaMenuDef, MenuItemDef } from '@/data/navigation';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

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
  const isMenuActive = (menu: MegaMenuDef) =>
    menu.basePaths.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));

  return (
    <header
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200/80'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-8 [@media(min-width:1240px)_and_(max-width:1399px)]:gap-6 [@media(min-width:1240px)_and_(max-width:1399px)]:px-5 [@media(min-width:1400px)]:gap-8">
        {/* ─── Zone 1 : logo + nom ─── */}
        <Link to="/" className="flex shrink-0 items-center gap-3 transition-transform duration-200 hover:scale-[1.02]">
          <img src="/logo.png" alt="ASFO Logo" className="h-12 w-12 rounded-full object-contain" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span style={poppins} className="text-lg font-extrabold tracking-tight text-[#123f38]">
              ASFO
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 [@media(min-width:1240px)_and_(max-width:1499px)]:hidden">
              Action Sanitaire pour le Fouta
            </span>
          </span>
        </Link>

        {/* ─── Zone 2 : navigation desktop ─── */}
        <NavigationMenu className="hidden min-w-0 max-w-none flex-1 justify-center [@media(min-width:1240px)]:flex">
          <NavigationMenuList className="flex-nowrap gap-1 whitespace-nowrap [@media(min-width:1240px)_and_(max-width:1399px)]:gap-0.5">
            <NavigationMenuItem>
              <PlainNavLink to="/" active={isActive('/')}>
                Accueil
              </PlainNavLink>
            </NavigationMenuItem>

            {megaMenus.map((menu) => (
              <NavigationMenuItem key={menu.label}>
                <NavigationMenuTrigger
                  style={poppins}
                  className={`h-auto whitespace-nowrap bg-transparent px-2.5 py-2 text-[14px] font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-[#e8f3ef] focus:bg-[#e8f3ef] data-[state=open]:bg-[#e8f3ef] data-[state=open]:text-teal-700 [@media(min-width:1240px)_and_(max-width:1399px)]:px-2 ${
                    isMenuActive(menu) ? 'text-teal-600' : 'text-gray-600 hover:text-teal-700'
                  }`}
                >
                  {menu.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MegaMenuPanel menu={menu} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <PlainNavLink to="/contact" active={isActive('/contact')}>
                Contact
              </PlainNavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* ─── Zone 3 : actions desktop ─── */}
        <div className="hidden shrink-0 items-center gap-3 whitespace-nowrap uppercase tracking-wider [@media(min-width:1240px)]:flex">
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-teal-500/60 px-3 text-[13px] font-medium text-teal-600 transition-all duration-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 [@media(min-width:1400px)]:px-4"
          >
            <Link to="/candidature">Candidature</Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-lg bg-[#e5533d] px-3 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#d04832] [@media(min-width:1400px)]:px-4"
          >
            <Link to="/donate">
              <Heart className="mr-1 h-3.5 w-3.5" />
              Don
            </Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-lg px-3 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 [@media(min-width:1400px)]:px-4"
            style={{ background: 'linear-gradient(135deg, #2fb391, #178066)', boxShadow: '0 2px 8px rgba(23,128,102,0.3)' }}
          >
            <Link to="/member-card">
              <CreditCard className="mr-1 h-3.5 w-3.5" />
              Ma Carte
            </Link>
          </Button>
        </div>

        {/* ─── Mobile Hamburger ─── */}
        <div className="[@media(min-width:1240px)]:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className="h-11 w-11 text-gray-700 hover:bg-gray-100 hover:text-teal-600"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[320px] flex-col border-l border-gray-100 bg-white p-0 sm:w-[380px]"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <img src="/logo.png" alt="ASFO Logo" className="h-11 w-11 rounded-full object-contain" />
                <span className="flex flex-col leading-tight">
                  <span style={poppins} className="text-base font-extrabold text-[#123f38]">
                    ASFO
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-widest text-gray-500">
                    Action Sanitaire pour le Fouta
                  </span>
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="flex flex-col gap-0.5">
                  <MobileLink to="/" active={isActive('/')} onClick={() => setMobileOpen(false)}>
                    Accueil
                  </MobileLink>

                  {megaMenus.map((menu) => (
                    <div key={menu.label} className="mt-4">
                      <span
                        style={poppins}
                        className="px-3 text-xs font-bold uppercase tracking-widest text-teal-800"
                      >
                        {menu.label}
                      </span>
                      <div className="ml-2 mt-1.5 flex flex-col gap-0.5 border-l-2 border-teal-100 pl-3">
                        {menu.columns.flatMap((col) => col.items).map((item) => (
                          <MobileLink
                            key={`${menu.label}-${item.to}-${item.title}`}
                            to={item.to}
                            active={isActive(item.to)}
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.title}
                          </MobileLink>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="my-4 h-px bg-gray-100" />
                  <MobileLink to="/contact" active={isActive('/contact')} onClick={() => setMobileOpen(false)}>
                    Contact
                  </MobileLink>
                </div>

                {/* Mobile actions */}
                <div className="mt-8 flex flex-col gap-2.5 uppercase tracking-wider">
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full justify-center rounded-lg border-teal-500/60 text-[13px] font-medium text-teal-600 hover:bg-teal-50"
                  >
                    <Link to="/candidature" onClick={() => setMobileOpen(false)}>
                      Candidature
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-11 w-full justify-center rounded-lg bg-[#e5533d] text-[13px] font-medium text-white hover:bg-[#d04832]"
                  >
                    <Link to="/donate" onClick={() => setMobileOpen(false)}>
                      <Heart className="mr-1.5 h-4 w-4" />
                      Faire un don
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-11 w-full justify-center rounded-lg text-[13px] font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, #2fb391, #178066)' }}
                  >
                    <Link to="/member-card" onClick={() => setMobileOpen(false)}>
                      <CreditCard className="mr-1.5 h-4 w-4" />
                      Ma Carte Membre
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

/* ─── Panneau méga-menu (colonnes + bande CTA) ─── */
function MegaMenuPanel({ menu }: { menu: MegaMenuDef }) {
  const three = menu.columns.length >= 3;
  return (
    <div className={`${three ? 'w-[840px] max-w-[92vw]' : 'w-[620px] max-w-[92vw]'} p-0`}>
      <div className={`grid gap-1 p-4 ${three ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {menu.columns.map((col) => (
          <div key={col.heading} className="min-w-0">
            <p className="px-3 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-widest text-teal-800/70">
              {col.heading}
            </p>
            <div className="flex flex-col gap-0.5">
              {col.items.map((item) => (
                <MegaMenuItem key={`${item.to}-${item.title}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {menu.cta && (
        <div className="flex items-center justify-between gap-4 border-t border-[#d5e5e0] bg-gradient-to-r from-[#e8f3ef] to-[#eef6f2] px-6 py-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#123f38]">{menu.cta.title}</p>
            <p className="truncate text-xs text-[#3d5a55]">{menu.cta.description}</p>
          </div>
          <NavigationMenuLink asChild>
            <Link
              to={menu.cta.to}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white no-underline shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
            >
              {menu.cta.buttonLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </NavigationMenuLink>
        </div>
      )}
    </div>
  );
}

function MegaMenuItem({ item }: { item: MenuItemDef }) {
  const Icon = item.icon;
  return (
    <NavigationMenuLink asChild>
      <Link
        to={item.to}
        className="group flex items-start gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors hover:bg-teal-50/60 focus-visible:bg-teal-50/60"
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700">{item.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500 line-clamp-2">{item.description}</p>
        </div>
        <ChevronRight className="ml-auto mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-teal-500" />
      </Link>
    </NavigationMenuLink>
  );
}

/* ─── Lien simple de la nav desktop (souligné teal si actif) ─── */
function PlainNavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={to}
        style={poppins}
        className={`group relative inline-flex whitespace-nowrap items-center rounded-md px-2.5 py-2 text-[14px] font-bold uppercase tracking-wide no-underline transition-colors duration-200 hover:bg-[#e8f3ef] [@media(min-width:1240px)_and_(max-width:1399px)]:px-2 ${
          active ? 'text-teal-600' : 'text-gray-600 hover:text-teal-700'
        }`}
      >
        {children}
        <span
          className={`absolute inset-x-2.5 -bottom-[1.35rem] h-[2px] rounded-full bg-teal-500 transition-all duration-300 ${
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
      </Link>
    </NavigationMenuLink>
  );
}

/* ─── Lien du menu mobile ─── */
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
      className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
        active ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
      }`}
    >
      {children}
    </Link>
  );
}

export default Header;
