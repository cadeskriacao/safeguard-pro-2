import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconHome, IconClipboard, IconPlusCircle, IconShield, IconBuilding, IconUser } from './Icons';
import { APP_ROUTES } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Hide layout elements on auth pages
  // Hide layout elements on auth pages and landing page
  const isAuthPage = [APP_ROUTES.LOGIN, APP_ROUTES.REGISTER, APP_ROUTES.FORGOT_PASSWORD, APP_ROUTES.RESET_PASSWORD, APP_ROUTES.LANDING].includes(location.pathname);

  const handleSignOut = async () => {
    await signOut();
    navigate(APP_ROUTES.LOGIN);
  };

  const getLinkClass = (path: string, isMobile: boolean = true) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

    if (isMobile) {
      // Mobile styles
      return `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-emerald-800 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-slate-500'
        }`;
    } else {
      // Desktop Sidebar styles
      const baseClass = "flex items-center space-x-4 w-full px-6 py-4 rounded-xl transition-all duration-200";
      // FIX: Added dark:bg-none to remove light gradient in dark mode
      const activeClass = isActive
        ? 'bg-gradient-emerald-soft dark:bg-none dark:bg-slate-800 border-r-4 border-emerald-500 text-emerald-900 dark:text-emerald-400 font-bold shadow-sm'
        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white font-medium';
      return `${baseClass} ${activeClass}`;
    }
  };

  if (location.pathname === APP_ROUTES.LANDING) {
    return <>{children}</>;
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] dark:bg-slate-950 transition-colors duration-300">

      {/* --- DESKTOP SIDEBAR (Visible on md+) --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 fixed h-full z-30 shadow-sm dark:shadow-slate-900/50 rounded-r-[2rem] py-8 pl-4 pr-4 transition-colors duration-300">
        <div className="px-6 mb-12 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-emerald-dark rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
            <IconShield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Sistema SST</h1>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto pr-2">

          <div>
            <p className="px-6 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">Menu</p>
            <div className="space-y-1">
              <Link to={APP_ROUTES.HOME} className={getLinkClass(APP_ROUTES.HOME, false)}>
                <IconHome className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link to={APP_ROUTES.PROJECTS} className={getLinkClass(APP_ROUTES.PROJECTS, false)}>
                <IconBuilding className="w-5 h-5" />
                <span>Obras</span>
              </Link>
              <Link to={APP_ROUTES.INSPECTION_LIST} className={getLinkClass(APP_ROUTES.INSPECTION_LIST, false)}>
                <IconPlusCircle className="w-5 h-5" />
                <span>Inspeções</span>
              </Link>
            </div>
          </div>

          <div>
            <p className="px-6 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">General</p>
            <div className="space-y-1">
              <Link to={APP_ROUTES.APR_LIST} className={getLinkClass(APP_ROUTES.APR_LIST, false)}>
                <IconClipboard className="w-5 h-5" />
                <span>Minhas APRs</span>
              </Link>
              <Link to={APP_ROUTES.PROFILE} className={getLinkClass(APP_ROUTES.PROFILE, false)}>
                <IconUser className="w-5 h-5" />
                <span>Perfil</span>
              </Link>
            </div>
          </div>

        </nav>

        {/* User Profile Snippet */}
        {/* FIX: Added dark:bg-none to remove light gradient in dark mode */}
        <div className="mt-8 mx-2 p-4 bg-gradient-emerald-soft dark:bg-none dark:bg-slate-800 rounded-2xl flex flex-col gap-3 border border-emerald-50 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold shadow-inner">
              {user?.email?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Usuário</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-4 fixed top-0 w-full z-20 flex justify-between items-center shadow-sm border-b border-gray-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-emerald-dark rounded-lg flex items-center justify-center text-white">
            <IconShield className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Sistema SST</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
            {user?.email?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <button onClick={handleSignOut} className="text-xs text-red-500 font-bold">Sair</button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pt-8 md:pb-8">
          <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 text-gray-900 dark:text-gray-100">
            {children}
          </div>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 h-20 z-30 flex justify-around items-center px-4 pb-2 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] rounded-t-3xl transition-colors">
        <Link to={APP_ROUTES.HOME} className={getLinkClass(APP_ROUTES.HOME)}>
          <IconHome className="w-6 h-6" />
        </Link>

        <Link to={APP_ROUTES.PROJECTS} className={getLinkClass(APP_ROUTES.PROJECTS)}>
          <IconBuilding className="w-6 h-6" />
        </Link>

        <Link to={APP_ROUTES.INSPECTION_LIST} className="flex flex-col items-center justify-center -mt-8">
          <div className={`bg-gradient-emerald-dark rounded-full p-4 shadow-xl text-white hover:scale-105 transition-transform border-[6px] border-[#F3F4F6] dark:border-slate-950`}>
            <IconPlusCircle className="w-7 h-7" />
          </div>
        </Link>

        <Link to={APP_ROUTES.APR_LIST} className={getLinkClass(APP_ROUTES.APR_LIST)}>
          <IconClipboard className="w-6 h-6" />
        </Link>

        <Link to={APP_ROUTES.PROFILE} className={getLinkClass(APP_ROUTES.PROFILE)}>
          <IconUser className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
};

export default Layout;