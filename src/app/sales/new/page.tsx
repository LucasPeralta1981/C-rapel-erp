// src/app/sales/new/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { productos, clientes } from '@/data/mockData';
import { Plus, X, Save, FileText } from 'lucide-react';

export default function NewSalePage() {
  const router = useRouter();
  
  // Estados del formulario
  const [clienteInput, setClienteInput] = useState('');
  const [productoInput, setProductoInput] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [tipo, setTipo] = useState<'Venta' | 'Presupuesto'>('Venta');
  const [loading, setLoading] = useState(false);

  // Estados para las sugerencias
  const [sugerenciasCliente, setSugerenciasCliente] = useState<typeof clientes>([]);
  const [sugerenciasProducto, setSugerenciasProducto] = useState<typeof productos>([]);
  const [mostrarCliente, setMostrarCliente] = useState(false);
  const [mostrarProducto, setMostrarProducto] = useState(false);

  // Referencias para cerrar al hacer clic fuera
  const clienteRef = useRef<HTMLDivElement>(null);
  const productoRef = useRef<HTMLDivElement>(null);

  // Filtrar clientes mientras se escribe
  useEffect(() => {
    if (clienteInput.length > 0) {
      const filtrados = clientes.filter(c => 
        c.nombre.toLowerCase().includes(clienteInput.toLowerCase())
      );
      setSugerenciasCliente(filtrados);
      setMostrarCliente(true);
    } else {
      setMostrarCliente(false);
      setSugerenciasCliente([]);
    }
  }, [clienteInput]);

  // Filtrar productos mientras se escribe
  useEffect(() => {
    if (productoInput.length > 0) {
      const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(productoInput.toLowerCase())
      );
      setSugerenciasProducto(filtrados);
      setMostrarProducto(true);
    } else {
      setMostrarProducto(false);
      setSugerenciasProducto([]);
    }
  }, [productoInput]);

  // Cerrar listas al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clienteRef.current && !clienteRef.current.contains(event.target as Node)) setMostrarCliente(false);
      if (productoRef.current && !productoRef.current.contains(event.target as Node)) setMostrarProducto(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteInput || !productoInput) {
      alert("Por favor selecciona un cliente y un producto de la lista.");
      return;
    }

    setLoading(true);
    // Simular guardado
    await new Promise(r => setTimeout(r, 800));
    alert(`${tipo} guardada con éxito para ${clienteInput}!`);
    setLoading(false);
    router.push('/sales');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Nueva {tipo === 'Venta' ? 'Venta' : 'Presupuesto'}</h1>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">Cancelar</button>
      </div>

      <form onSubmit={handleGuardar} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        
        {/* Selector Tipo */}
        <div className="flex gap-4 mb-4 p-2 bg-gray-50 rounded">
          <label className="flex items-center cursor-pointer">
            <input type="radio" name="tipo" value="Venta" checked={tipo === 'Venta'} onChange={() => setTipo('Venta')} className="mr-2" />
            <span className="font-medium text-green-700">🛒 Venta Directa</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="radio" name="tipo" value="Presupuesto" checked={tipo === 'Presupuesto'} onChange={() => setTipo('Presupuesto')} className="mr-2" />
            <span className="font-medium text-yellow-700">📄 Presupuesto (Standby)</span>
          </label>
        </div>

        {/* Cliente con Autocompletado */}
        <div ref={clienteRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <input
            type="text"
            value={clienteInput}
            onChange={(e) => setClienteInput(e.target.value)}
            placeholder="Escribe el nombre del cliente..."
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            autoComplete="off"
          />
          {mostrarCliente && sugerenciasCliente.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 shadow-lg max-h-40 overflow-y-auto">
              {sugerenciasCliente.map((c) => (
                <li 
                  key={c.id} 
                  onClick={() => { setClienteInput(c.nombre); setMostrarCliente(false); }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  {c.nombre} <span className="text-gray-400 text-xs">({c.ruf})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Producto con Autocompletado */}
        <div ref={productoRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
          <input
            type="text"
            value={productoInput}
            onChange={(e) => setProductoInput(e.target.value)}
            placeholder="Escribe el nombre del producto..."
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            autoComplete="off"
          />
          {mostrarProducto && sugerenciasProducto.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 shadow-lg max-h-40 overflow-y-auto">
              {sugerenciasProducto.map((p) => (
                <li 
                  key={p.id} 
                  onClick={() => { setProductoInput(p.nombre); setMostrarProducto(false); }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between"
                >
                  <span>{p.nombre}</span>
                  <span className="text-gray-500 font-semibold">${p.precio.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Estimado</p>
            <p className="text-xl font-bold text-blue-600">
              ${(cantidad * (productos.find(p => p.nombre === productoInput)?.precio || 0)).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Procesando...' : (
            <>
              <Save size={20} /> Guardar {tipo}
            </>
          )}
        </button>
      </form>
    </div>
  );
}