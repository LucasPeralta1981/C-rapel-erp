'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState({
    sales: 0,
    products: 0,
    clients: 0,
    lowStock: 0
  });

  useEffect(() => {
    // Simulación de datos
    setStats({
      sales: 125000,
      products: 450,
      clients: 120,
      lowStock: 15
    });
  }, []);

  const statCards = [
    { icon: DollarSign, label: 'Ventas Totales', value: stats.sales, color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Package, label: 'Productos', value: stats.products, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Users, label: 'Clientes', value: stats.clients, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: TrendingUp, label: 'Stock Bajo', value: stats.lowStock, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.bg} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{
              card.label === 'Stock Bajo' 
                ? card.value 
                : formatCurrency(card.value)
            }</p>
            <p className="text-gray-600 mt-2">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}