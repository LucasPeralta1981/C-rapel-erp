'use client'; // Necesario para usar estados y eventos

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSalePage() {
  const router = useRouter();
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí enviaremos los datos a tu API (más adelante)
      // Por ahora, simulamos que se guarda
      console.log('Venta guardada:', { cliente, producto, cantidad, precio });
      
      // Simular un pequeño retraso
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('¡Venta guardada con éxito!');
      router.push('/sales'); // Redirigir a la lista de ventas
    } catch (error) {
      console.error('Error al guardar venta:', error);
      alert('Error al guardar la venta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Nueva Venta</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Nombre del cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
          <input
            type="text"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Nombre del producto"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p className="text-lg font-semibold">Total: <span className="text-green-600">${(cantidad * precio).toFixed(2)}</span></p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Guardando...' : 'Guardar Venta'}
        </button>
      </form>
    </div>
  );
}