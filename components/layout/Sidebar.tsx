'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, 
  FileText, Settings, LogOut, Upload
} from 'lucide-react';

const menu = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
  { path: '/import', label: 'Importar Excel', icon: Upload },
  { path: '/clients', label: 'Clientes/Proveedores', icon: Users },
  { path: '/products', label: 'Productos', icon: Package },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white shadow-xl z-50">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">R</div>
          <div>
            <h1 className="text-xl font-bold">R.A.P.E.L</h1>
            <p className="text-xs text-slate-400">Distribuidora</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}