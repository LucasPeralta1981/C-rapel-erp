// src/app/sales/new/page.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { productos, clientes } from '@/data/mockData';
import { Plus, Trash2, ShoppingCart, Search, Tag, Percent, AlertCircle, ArrowLeft, Printer, Save } from 'lucide-react';

interface CarritoItem {
  id: string;
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  stock: number;
}

export default function NewSalePage() {
  const router = useRouter();
  
  // --- ESTADOS ---
  const [clienteInput, setClienteInput] = useState('');
  const [productoInput, setProductoInput] = useState('');
  const [cantidadInput, setCantidadInput] = useState(1);
  const [descuento, setDescuento] = useState(0);
  const [tipo, setTipo] = useState<'Venta' | 'Presupuesto'>('Venta');
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados de UI
  const [mostrarCliente, setMostrarCliente] = useState(false);
  const [mostrarProducto, setMostrarProducto] = useState(false);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  const [errorStock, setErrorStock] = useState<string | null>(null);

  // Refs
  const clienteRef = useRef<HTMLDivElement>(null);
  const productoRef = useRef<HTMLDivElement>(null);
  const inputProductoRef = useRef<HTMLInputElement>(null);
  const listaProductoRef = useRef<HTMLUListElement>(null);

  // --- LÓGICA DE FILTRADO ---
  const sugerenciasCliente = useMemo(() => {
    if (!clienteInput) return [];
    return clientes.filter(c => c.nombre.toLowerCase().includes(clienteInput.toLowerCase()));
  }, [clienteInput]);

  const sugerenciasProducto = useMemo(() => {
    if (!productoInput) return [];
    return productos.filter(p => p.nombre.toLowerCase().includes(productoInput.toLowerCase()));
  }, [productoInput]);

  // --- EFECTOS ---
  useEffect(() => {
    setMostrarCliente(sugerenciasCliente.length > 0 && clienteInput.length > 0);
  }, [sugerenciasCliente, clienteInput]);

  useEffect(() => {
    setMostrarProducto(sugerenciasProducto.length > 0 && productoInput.length > 0);
    setIndiceSeleccionado(0);
  }, [sugerenciasProducto, productoInput]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clienteRef.current && !clienteRef.current.contains(event.target as Node)) setMostrarCliente(false);
      if (productoRef.current && !productoRef.current.contains(event.target as Node)) setMostrarProducto(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mostrarProducto) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndiceSeleccionado(prev => Math.min(prev + 1, sugerenciasProducto.length - 1));
        const lista = listaProductoRef.current;
        if (lista) {
          const item = lista.children[indiceSeleccionado + 1] as HTMLElement;
          if (item) item.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndiceSeleccionado(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && indiceSeleccionado >= 0) {
        e.preventDefault();
        const productoSeleccionado = sugerenciasProducto[indiceSeleccionado];
        if (productoSeleccionado) {
          setProductoInput(productoSeleccionado.nombre);
          setMostrarProducto(false);
          inputProductoRef.current?.blur();
        }
      } else if (e.key === 'Escape') {
        setMostrarProducto(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mostrarProducto, indiceSeleccionado, sugerenciasProducto]);

  // --- ACCIONES ---
  const validarStock = (producto: any, cant: number) => {
    if (cant > producto.stock) {
      setErrorStock(`Stock insuficiente. Máximo disponible: ${producto.stock}`);
      return false;
    }
    setErrorStock(null);
    return true;
  };

  const agregarAlCarrito = () => {
    if (!productoInput) return;
    
    const producto = productos.find(p => p.nombre === productoInput);
    if (!producto) return;

    if (!validarStock(producto, cantidadInput)) return;

    // Verificar si ya está en el carrito para sumar cantidad
    const existe = carrito.find(item => item.productoId === producto.id);
    if (existe) {
      const nuevaCantidad = existe.cantidad + cantidadInput;
      if (nuevaCantidad > producto.stock) {
        setErrorStock(`Stock insuficiente para sumar más. Máximo: ${producto.stock}`);
        return;
      }
      setCarrito(carrito.map(item => 
        item.productoId === producto.id 
          ? { ...item, cantidad: nuevaCantidad, subtotal: item.precio * nuevaCantidad }
          : item
      ));
    } else {
      const subtotal = producto.precio * cantidadInput;
      const nuevoItem: CarritoItem = {
        id: `${producto.id}-${Date.now()}`,
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidadInput,
        subtotal: subtotal,
        stock: producto.stock
      };
      setCarrito([...carrito, nuevoItem]);
    }
    
    setProductoInput('');
    setCantidadInput(1);
    setErrorStock(null);
    inputProductoRef.current?.focus();
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularTotales = () => {
    const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const descuentoMonto = subtotal * (descuento / 100);
    const total = subtotal - descuentoMonto;
    return { subtotal, descuentoMonto, total };
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteInput) {
      alert("Selecciona un cliente.");
      return;
    }
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulación de API
    
    const { total } = calcularTotales();
    
    // Aquí iría la lógica real de guardado en BD
    alert(`✅ ${tipo} guardada exitosamente!\n\nCliente: ${clienteInput}\nTotal: $${total.toLocaleString()}`);
    
    setLoading(false);
    router.push('/sales');
  };

  const { subtotal, descuentoMonto, total } = calcularTotales();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Nueva {tipo === 'Venta' ? 'Venta' : 'Presupuesto'}</h1>
              <p className="text-blue-200 text-xs">Sistema de Ventas Pro - Lucas</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <ArrowLeft size={16} /> Cancelar
            </button>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition"
              title="Imprimir"
            >
              <Printer size={16} /> Imprimir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: CONTROLES */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. Selección de Cliente */}
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Tag size={16} /> Cliente
            </h2>
            <div ref={clienteRef} className="relative">
              <input
                type="text"
                value={clienteInput}
                onChange={(e) => setClienteInput(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                autoComplete="off"
              />
              {mostrarCliente && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl max-h-60 overflow-y-auto">
                  {sugerenciasCliente.map((c) => (
                    <li 
                      key={c.id} 
                      onClick={() => { setClienteInput(c.nombre); setMostrarCliente(false); }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 transition"
                    >
                      <div className="font-semibold text-gray-800">{c.nombre}</div>
                      <div className="text-xs text-gray-500">{c.ruf}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 2. Selección de Producto */}
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Search size={16} /> Producto
            </h2>
            
            <div ref={productoRef} className="relative mb-3">
              <input
                ref={inputProductoRef}
                type="text"
                value={productoInput}
                onChange={(e) => {
                  setProductoInput(e.target.value);
                  setIndiceSeleccionado(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !mostrarProducto) agregarAlCarrito();
                }}
                placeholder="Buscar producto..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none transition"
                autoComplete="off"
              />
              {mostrarProducto && (
                <ul 
                  ref={listaProductoRef}
                  className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl max-h-60 overflow-y-auto"
                >
                  {sugerenciasProducto.map((p, idx) => (
                    <li 
                      key={p.id} 
                      onClick={() => { 
                        setProductoInput(p.nombre); 
                        setMostrarProducto(false); 
                        inputProductoRef.current?.blur();
                      }}
                      className={`px-4 py-3 cursor-pointer border-b last:border-0 flex justify-between items-center transition ${idx === indiceSeleccionado ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <div>
                        <div className="font-semibold text-gray-800">{p.nombre}</div>
                        <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                      </div>
                      <div className="font-bold text-green-700">${p.precio.toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {errorStock && (
              <div className="bg-red-50 text-red-600 p-2 rounded text-sm flex items-center gap-2 mb-3 border border-red-100">
                <AlertCircle size={16} /> {errorStock}
              </div>
            )}

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 mb-1 block">CANTIDAD</label>
                <input
                  type="number"
                  min="1"
                  value={cantidadInput}
                  onChange={(e) => setCantidadInput(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-center text-xl font-bold focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={agregarAlCarrito}
                disabled={!productoInput}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 rounded-lg flex flex-col items-center justify-center transition shadow-md min-w-[90px]"
              >
                <Plus size={20} className="mb-1" />
                <span className="text-xs font-bold">AGREGAR</span>
              </button>
            </div>
          </div>

          {/* 3. Descuento */}
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Percent size={16} /> Descuento
              </h2>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">{descuento}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={descuento}
              onChange={(e) => setDescuento(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Sin descuento</span>
              <span>50% OFF</span>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: CARRITO Y RESUMEN */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden border border-gray-200 h-[calc(100vh-140px)]">
            
            {/* Cabecera del Carrito */}
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Detalle del Pedido</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {carrito.length} ítems
              </span>
            </div>

            {/* Tabla de Productos (CARRITO) */}
            <div className="flex-1 overflow-auto p-0">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                  <ShoppingCart size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium text-gray-600">El carrito está vacío</p>
                  <p className="text-sm">Selecciona productos del panel izquierdo para comenzar</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Cant.</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Precio Unit.</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Subtotal</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-10">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {carrito.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-800">{item.nombre}</td>
                        <td className="p-4 text-center text-gray-600">{item.cantidad}</td>
                        <td className="p-4 text-right text-gray-600">${item.precio.toLocaleString()}</td>
                        <td className="p-4 text-right font-bold text-gray-800">${item.subtotal.toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="text-red-400 hover:text-red-600 transition p-1 rounded hover:bg-red-50"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer: Resumen Total y Botón Guardar */}
            <div className="bg-gray-50 p-6 border-t shrink-0">
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-medium text-gray-800">${subtotal.toLocaleString()}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-gray-500">Descuento ({descuento}%):</span>
                  <span className="font-medium text-red-600">-${descuentoMonto.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-700">TOTAL A PAGAR:</span>
                <span className="text-3xl font-bold text-blue-700">${total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleGuardar}
                disabled={loading || carrito.length === 0 || !clienteInput}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <Save size={24} />
                    {tipo === 'Venta' ? 'Finalizar Venta' : 'Guardar Presupuesto'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}