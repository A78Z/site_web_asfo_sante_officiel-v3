import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Archive,
  Image,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  Menu,
  ExternalLink,
  CreditCard,
  HeartHandshake,
  Mail,
  Newspaper,
} from 'lucide-react';

const navSections = [
  {
    label: 'Principal',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Candidatures', path: '/admin/candidatures', icon: FileText },
      { name: 'Cartes membres', path: '/admin/cartes-membres', icon: CreditCard },
      { name: 'Demandes bénévoles', path: '/admin/benevoles', icon: HeartHandshake },
      { name: 'Messages reçus', path: '/admin/messages', icon: Mail },
      { name: 'Newsletter', path: '/admin/newsletter', icon: Newspaper },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { name: 'Actualités', path: '/admin/news', icon: Newspaper },
      { name: 'Utilisateurs', path: '/admin/users', icon: Users },
      { name: 'Archives missions', path: '/admin/archives', icon: Archive },
      { name: 'Galerie', path: '/admin/gallery', icon: Image },
      { name: 'Statistiques', path: '/admin/statistics', icon: BarChart3 },
    ],
  },
  {
    label: 'Système',
    items: [
      { name: 'Paramètres', path: '/admin/settings', icon: Settings },
    ],
  },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stored = localStorage.getItem('asfo_admin');
  const adminUser = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!adminUser?.isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [adminUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('asfo_admin');
    navigate('/admin/login');
  };

  if (!adminUser?.isAdmin) return null;

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/admin' && location.pathname.startsWith(path));

  const currentTitle =
    navSections
      .flatMap((s) => s.items)
      .find((item) => isActive(item.path))?.name ?? 'Dashboard';

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <img src="/logo.png" alt="ASFO" className="h-9 w-9 rounded-full object-contain" />
        <span className="text-base font-bold tracking-tight text-gray-900">
          ASFO <span className="text-teal-600">Admin</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      active
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] ${active ? 'text-teal-600' : 'text-gray-400'}`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin info */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
            {adminUser?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AD'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{adminUser?.name || 'Administrateur'}</p>
            <p className="truncate text-xs text-gray-500">{adminUser?.email || 'admin@asfo-sante.org'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir le site
          </Link>
          <button
            onClick={handleLogout}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ─── Desktop sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-gray-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* ─── Mobile sidebar overlay ─── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 flex h-full w-72 flex-col bg-white shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ─── Main area ─── */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/95 px-6 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-bold text-gray-900">{currentTitle}</h1>

          <div className="ml-auto flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="h-9 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
              {adminUser?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AD'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
