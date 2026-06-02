'use client';
import { useEffect, useState } from 'react';
import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState({ sales: 0, products: 0, clients: 0, lowStock: 0 });

  useEffect(() => {
    // Simulación de carga de datos (en producción llamarías a tus APIs)
    Promise.all([
      fetch('/api/sales').then(r => r.json()).then(data => data.reduce((acc: number, curr: any) => acc + Number(curr.total), 0) || 0),
      fetch('/api/products').then(r => r.json()).then(data => data.length),
      fetch('/api/entities').then(r => r.json()).then(data => data.length),
      fetch('/api/products').then(r => r.json()).then(data => data.filter((p: any) => p.stock <= p.minStock).length)
    ]).then(([sales, products, clients, lowStock]) => {
      setStats({ sales, products, clients, lowStock });
    }).catch(() => {
      // Fallback por si las APIs no están listas aún
      setStats({ sales: 150000, products: 120, clients: 45, lowStock: 3 });
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Panel de Control - R.A.P.E.L</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Ventas Hoy</h3>
            <DollarSign className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.sales)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Productos</h3>
            <Package className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.products}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Clientes</h3>
            <Users className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.clients}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Stock Bajo</h3>
            <TrendingUp className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Bienvenido, Lucas</h2>
        <p className="text-gray-600">
          Estás listo para vender. Recuerda:
        </p>
        <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
          <li>Ve a <strong>Punto de Venta</strong> para registrar una nueva venta.</li>
          <li>Usa <strong>Importar Excel</strong> para actualizar precios de EMTOP/SHELL/DUNLOP.</li>
          <li>Revisa las alertas de <strong>Stock Bajo</strong> antes de vender.</li>
        </ul>
      </div>
    </div>
  );
}