"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2, Save, FileText, DollarSign, AlertCircle } from "lucide-react";

// Simulamos los datos que ya tienes
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface Cliente {
  id: number;
  nombre: string;
  rut: string;
}

// Simulación de datos (en producción vendrían de tu DB)
const productosDisponibles: Producto[] = [
  { id: 1, nombre: "Juego de Llaves Emtop 1/4\"", precio: 45000, stock: 20 },
  { id: 4, nombre: "Aceite Motor SHELL 10W-40", precio: 18500, stock: 50 },
  { id: 7, nombre: "Neumático Dunlop 205/55 R16", precio: 85000, stock: 10 },
];

const clientesList: Cliente[] = [
  { id: 1, nombre: "Juan Pérez", rut: "12.345.678-9" },
  { id: 2, nombre: "AutoService El Sol", rut: "76.123.456-7" },
];

// Simulación de "Presupuestos en Standby"
interface Presupuesto {
  id: number;
  clienteId: number;
  clienteNombre: string;
  items: { productoId: number; nombre: string; cantidad: number; precio: number }[];
  total: number;
  fecha: string;
  estado: "pendiente" | "vencido" | "convertido";
}

export default function NuevaVentaPage() {
  const router = useRouter();
  
  // Estado del formulario actual
  const [tipoDocumento, setTipoDocumento] = useState<"VENTA" | "PRESUPUESTO">("PRESUPUESTO");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [carrito, setCarrito] = useState<any[]>([]);
  
  // Simulación de lista de presupuestos en espera (Standby)
  const [presupuestosPendientes, setPresupuestosPendientes] = useState<Presupuesto[]>([
    {
      id: 101,
      clienteId: 1,
      clienteNombre: "Juan Pérez",
      items: [{ productoId: 4, nombre: "Aceite Motor SHELL 10W-40", cantidad: 2, precio: 18500 }],
      total: 37000,
      fecha: "2023-10-26",
      estado: "pendiente"
    }
  ]);

  // Filtrado de productos
  const productosFiltrados = useMemo(() => {
    if (!busquedaProducto) return productosDisponibles;
    return productosDisponibles.filter(p => 
      p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
    );
  }, [busquedaProducto]);

  // Agregar al carrito
  const agregarAlCarrito = (producto: Producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Eliminar del carrito
  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  const guardarDocumento = () => {
    if (!clienteSeleccionado) {
      alert("Debes seleccionar un cliente.");
      return;
    }
    if (carrito.length === 0) {
      alert("El documento está vacío.");
      return;
    }

    const cliente = clientesList.find(c => c.id.toString() === clienteSeleccionado);
    const total = calcularTotal();

    if (tipoDocumento === "PRESUPUESTO") {
      const nuevoPresupuesto: Presupuesto = {
        id: Date.now(),
        clienteId: parseInt(clienteSeleccionado),
        clienteNombre: cliente?.nombre || "Desconocido",
        items: carrito.map(item => ({
          productoId: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio
        })),
        total,
        fecha: new Date().toISOString().split('T')[0],
        estado: "pendiente"
      };
      
      setPresupuestosPendientes([...presupuestosPendientes, nuevoPresupuesto]);
      alert("✅ Presupuesto guardado en 'Standby'. Listo para convertir luego.");
      setCarrito([]);
    } else {
      // Lógica para VENTA (aquí restarías stock en producción)
      alert("✅ Venta registrada con éxito. Stock actualizado.");
      setCarrito([]);
      router.push("/sales"); // Ir a lista de ventas
    }
  };

  const convertirPresupuesto = (id: number) => {
    const presupuesto = presupuestosPendientes.find(p => p.id === id);
    if (!presupuesto) return;

    if (confirm(`¿Convertir presupuesto #${id} de ${presupuesto.clienteNombre} en Venta Real?`)) {
      // Aquí iría la lógica de descuento de stock y generación de factura
      alert(`💰 Presupuesto #${id} convertido a Venta. ¡Listo para cobrar!`);
      setPresupuestosPendientes(prev => prev.map(p => 
        p.id === id ? { ...p, estado: "convertido" } : p
      ));
    }
  };

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col md:flex-row gap-6">
      {/* SECCIÓN IZQUIERDA: Creación de Documento */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {tipoDocumento === "PRESUPUESTO" ? "📄 Nuevo Presupuesto" : "💰 Nueva Venta"}
        </h2>

        {/* Selector de Tipo */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTipoDocumento("PRESUPUESTO")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              tipoDocumento === "PRESUPUESTO" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Presupuesto (Standby)
          </button>
          <button
            onClick={() => setTipoDocumento("VENTA")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              tipoDocumento === "VENTA" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Venta Directa
          </button>
        </div>

        {/* Selección de Cliente */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Seleccione un cliente...</option>
            {clientesList.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} ({c.rut})</option>
            ))}
          </select>
        </div>

        {/* Buscador de Productos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Producto</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Ej: Aceite Shell, Llaves..."
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Lista de Productos Disponibles */}
        <div className="mb-6 max-h-48 overflow-y-auto border rounded-lg">
          {productosFiltrados.map(prod => (
            <div key={prod.id} className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
              <div>
                <div className="font-medium text-gray-800">{prod.nombre}</div>
                <div className="text-sm text-gray-500">Stock: {prod.stock} | {formatPrice(prod.precio)}</div>
              </div>
              <button
                onClick={() => agregarAlCarrito(prod)}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition"
              >
                <Plus size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Carrito / Resumen */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Resumen</h3>
          {carrito.length === 0 ? (
            <p className="text-gray-500 text-sm">Agrega productos para comenzar.</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {carrito.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.cantidad}x {item.nombre}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatPrice(item.precio * item.cantidad)}</span>
                    <button onClick={() => eliminarDelCarrito(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between items-center border-t pt-2">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-xl text-blue-700">{formatPrice(calcularTotal())}</span>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          onClick={guardarDocumento}
          disabled={carrito.length === 0}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            carrito.length === 0 
              ? "bg-gray-300 cursor-not-allowed" 
              : tipoDocumento === "PRESUPUESTO" 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {tipoDocumento === "PRESUPUESTO" ? "Guardar Presupuesto (Standby)" : "Confirmar Venta"}
        </button>
      </div>

      {/* SECCIÓN DERECHA: Presupuestos en Espera (Standby) */}
      <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-md h-fit">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Presupuestos Pendientes</h3>
        </div>
        
        {presupuestosPendientes.filter(p => p.estado === "pendiente").length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <AlertCircle className="mx-auto mb-2" />
            <p>No hay presupuestos en espera.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {presupuestosPendientes
              .filter(p => p.estado === "pendiente")
              .map(pres => (
                <div key={pres.id} className="border rounded-lg p-3 bg-blue-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-sm text-gray-800">#{pres.id}</div>
                      <div className="text-xs text-gray-600">{pres.clienteNombre}</div>
                    </div>
                    <span className="text-xs font-bold text-blue-700">{formatPrice(pres.total)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {pres.items.length} ítems • {pres.fecha}
                  </div>
                  <button
                    onClick={() => convertirPresupuesto(pres.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 rounded transition flex items-center justify-center gap-1"
                  >
                    <DollarSign size={12} /> Convertir
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}