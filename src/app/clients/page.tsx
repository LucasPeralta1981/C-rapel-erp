"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, Trash2, UserPlus, Phone, MapPin, FileText } from "lucide-react";

interface Cliente {
  id: number;
  nombre: string;
  rut: string;
  telefono: string;
  direccion: string;
  email: string;
  estado: "Activo" | "Inactivo";
  ultimaCompra: string;
  totalCompras: number;
}

export default function ClientsPage() {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      rut: "12.345.678-9",
      telefono: "+56 9 1234 5678",
      direccion: "Av. Providencia 1234, Santiago",
      email: "juan.perez@email.com",
      estado: "Activo",
      ultimaCompra: "2023-10-25",
      totalCompras: 125000,
    },
    {
      id: 2,
      nombre: "AutoService El Sol SpA",
      rut: "76.123.456-7",
      telefono: "+56 2 2345 6789",
      direccion: "Calle Los Andes 567, Maipú",
      email: "contacto@autosol.cl",
      estado: "Activo",
      ultimaCompra: "2023-10-20",
      totalCompras: 450000,
    },
    {
      id: 3,
      nombre: "María González",
      rut: "9.876.543-2",
      telefono: "+56 9 9876 5432",
      direccion: "Av. Las Condes 890, Las Condes",
      email: "maria.gonzalez@email.com",
      estado: "Inactivo",
      ultimaCompra: "2023-08-15",
      totalCompras: 32000,
    },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estado del formulario
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    rut: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  // Filtrado de clientes
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.rut.includes(busqueda) ||
      cliente.telefono.includes(busqueda)
    );
  }, [clientes, busqueda]);

  const agregarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCliente.nombre || !nuevoCliente.rut) {
      alert("El nombre y el RUT son obligatorios.");
      return;
    }

    const cliente: Cliente = {
      id: clientes.length + 1,
      nombre: nuevoCliente.nombre,
      rut: nuevoCliente.rut,
      telefono: nuevoCliente.telefono,
      direccion: nuevoCliente.direccion,
      email: nuevoCliente.email,
      estado: "Activo",
      ultimaCompra: "N/A",
      totalCompras: 0,
    };

    setClientes([...clientes, cliente]);
    setNuevoCliente({ nombre: "", rut: "", telefono: "", direccion: "", email: "" });
    setMostrarFormulario(false);
    alert("¡Cliente agregado correctamente!");
  };

  const eliminarCliente = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.")) {
      setClientes(clientes.filter((c) => c.id !== id));
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-500">Administra tu base de datos de clientes y ventas</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <UserPlus size={20} />
          {mostrarFormulario ? "Cancelar" : "Nuevo Cliente"}
        </button>
      </div>

      {/* Formulario de Carga (Aparece/Desaparece) */}
      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar Nuevo Cliente</h2>
          <form onSubmit={agregarCliente} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Razón Social *</label>
              <input
                type="text"
                required
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Juan Pérez o AutoService SpA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RUT *</label>
              <input
                type="text"
                required
                value={nuevoCliente.rut}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, rut: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: 12.345.678-9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="cliente@email.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={nuevoCliente.direccion}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Av. Principal 1234"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Guardar Cliente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-2">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre, RUT o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border-none outline-none text-gray-700"
        />
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Últimas Compras
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {cliente.nombre.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                        <div className="text-sm text-gray-500">{cliente.rut}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {cliente.telefono || "Sin teléfono"}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        {cliente.direccion || "Sin dirección"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cliente.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cliente.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cliente.ultimaCompra !== "N/A" ? cliente.ultimaCompra : "Sin compras"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: {formatPrice(cliente.totalCompras)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => eliminarCliente(cliente.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron clientes con ese criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}