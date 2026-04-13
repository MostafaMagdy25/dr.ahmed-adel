import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  User, 
  GraduationCap, 
  Code, 
  FolderKanban, 
  Award, 
  Mail, 
  Menu, 
  X, 
  LogOut,
  HeartPulse,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../../components/ThemeToggle";


const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Hero Section", href: "/admin/hero", icon: ImageIcon },
  { name: "About Me", href: "/admin/about", icon: User },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Skills", href: "/admin/skills", icon: Code },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Certifications", href: "/admin/certifications", icon: Award },
  { name: "Contact", href: "/admin/contact", icon: Mail },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 transition-colors">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
            <HeartPulse className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            <span>Portfolio Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-1">
          <Link 
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full"
          >
            <HeartPulse className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            View Portfolio
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
              {sidebarLinks.find(l => l.href === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-slate-700 dark:text-slate-300">{admin?.name || 'Admin'}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{admin?.email || 'Administrator'}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              {(admin?.name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
