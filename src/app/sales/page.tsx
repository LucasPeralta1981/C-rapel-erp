// src/app/sales/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Venta {
  id: number;
  cliente: string;
  producto: string;
  cantidad: number;
  precio: number;
  total: number;
  fecha: string;
}

export default function SalesPage() {
  // Datos simulados (más adelante vendrán de la API)
  const [ventas, setVentas] = useState<Venta[]>([
    { id: 1, cliente: 'Juan Pérez', producto: 'Laptop', cantidad: 1, precio: 1200, total: 1200, fecha: '2023-10-01' },
    { id: 2, cliente: 'Ana Gómez', producto: 'Mouse', cantidad: 2, precio: 25, total: 50, fecha: '2023-10-02' },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Lista de Ventas</h1>
        <a 
          href="/sales/new" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Nueva Venta
        </a>
      </div>

      {ventas.length === 0 ? (
        <p className="text-gray-500">No hay ventas registradas.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unit.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.producto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${venta.precio.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">${venta.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}