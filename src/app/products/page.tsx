"use client";

import { useState } from "react";
import Link from "next/link";

// Definición de la interfaz
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  proveedor: string;
  imagen: string;
}

export default function ProductsPage() {
  // Catálogo de productos corregido (SHELL en lugar de SHLEE)
  const [productos, setProductos] = useState<Producto[]>([
    // --- HERRAMIENTAS EMTOP ---
    {
      id: 1,
      nombre: "Juego de Llaves Combinadas Emtop 1/4\"",
      descripcion: "Acero vanadio cromo 100%. Juego de 12 piezas. Alta resistencia.",
      precio: 45000,
      stock: 20,
      categoria: "Herramientas",
      proveedor: "Emtop",
      imagen: "https://m.media-amazon.com/images/I/71Xy+q+q+qL._AC_SL1500_.jpg",
    },
    {
      id: 2,
      nombre: "Pulidora Emtop 1200W",
      descripcion: "Pulidora eléctrica para acabados finos. 1200W de potencia.",
      precio: 89000,
      stock: 5,
      categoria: "Herramientas",
      proveedor: "Emtop",
      imagen: "https://m.media-amazon.com/images/I/61Xy+q+q+qL._AC_SL1500_.jpg",
    },
    {
      id: 3,
      nombre: "Set de Destornilladores Emtop",
      descripcion: "Set profesional de 20 piezas con punteras magnéticas.",
      precio: 22000,
      stock: 35,
      categoria: "Herramientas",
      proveedor: "Emtop",
      imagen: "https://m.media-amazon.com/images/I/81Xy+q+q+qL._AC_SL1500_.jpg",
    },

    // --- ACEITES Y LUBRICANTES SHELL (CORREGIDO) ---
    {
      id: 4,
      nombre: "Aceite Motor SHELL Helix HX8 5W-30 Sintético (4L)",
      descripcion: "Aceite sintético de alto rendimiento con tecnología PurePlus. Para motores modernos.",
      precio: 28500,
      stock: 50,
      categoria: "Lubricantes",
      proveedor: "SHELL",
      imagen: "https://m.media-amazon.com/images/I/71wXy+q+q+qL._AC_SL1500_.jpg", // Imagen sugerida de Shell
    },
    {
      id: 5,
      nombre: "Grasa Multifinal SHELL Gadus S2 V220",
      descripcion: "Grasa de litio multifinal para rodamientos y juntas. Excelente protección.",
      precio: 9500,
      stock: 25,
      categoria: "Lubricantes",
      proveedor: "SHELL",
      imagen: "https://m.media-amazon.com/images/I/61wXy+q+q+qL._AC_SL1500_.jpg", // Imagen sugerida de Shell
    },
    {
      id: 6,
      nombre: "Aceite de Transmisión SHELL Spirax S3 ATF",
      descripcion: "Aceite especial para cajas de cambio automáticas y sistemas hidráulicos.",
      precio: 14500,
      stock: 15,
      categoria: "Lubricantes",
      proveedor: "SHELL",
      imagen: "https://m.media-amazon.com/images/I/81wXy+q+q+qL._AC_SL1500_.jpg", // Imagen sugerida de Shell
    },

    // --- NEUMÁTICOS DUNLOP ---
    {
      id: 7,
      nombre: "Neumático Dunlop SP Sport 205/55 R16",
      descripcion: "Neumático de alto rendimiento para sedanes y hatchbacks. Aro 16.",
      precio: 85000,
      stock: 10,
      categoria: "Neumáticos",
      proveedor: "Dunlop",
      imagen: "https://m.media-amazon.com/images/I/71Xy+q+q+qL._AC_SL1500_.jpg",
    },
    {
      id: 8,
      nombre: "Neumático Dunlop Grandtrek AT50 (SUV)",
      descripcion: "Neumático todoterreno para SUVs. Gran agarre en pista y tierra.",
      precio: 145000,
      stock: 8,
      categoria: "Neumáticos",
      proveedor: "Dunlop",
      imagen: "https://m.media-amazon.com/images/I/61Xy+q+q+qL._AC_SL1500_.jpg",
    },

    // --- REPUESTOS LOCMA (TREN DELANTERO) ---
    {
      id: 9,
      nombre: "Brazo Oscilante Delantero LOCMA",
      descripcion: "Brazo oscilante completo con buje y rótula. Para vehículos populares.",
      precio: 35000,
      stock: 12,
      categoria: "Repuestos Tren Delantero",
      proveedor: "LOCMA",
      imagen: "https://m.media-amazon.com/images/I/81Xy+q+q+qL._AC_SL1500_.jpg",
    },
    {
      id: 10,
      nombre: "Kit Rótulas LOCMA (Par)",
      descripcion: "Par de rótulas superiores e inferiores. Alta durabilidad.",
      precio: 18000,
      stock: 20,
      categoria: "Repuestos Tren Delantero",
      proveedor: "LOCMA",
      imagen: "https://m.media-amazon.com/images/I/71Xy+q+q+qL._AC_SL1500_.jpg",
    },
  ]);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  const agregarProducto = () => {
    if (!nuevoNombre || !nuevoPrecio) return;
    const nuevoProducto: Producto = {
      id: productos.length + 1,
      nombre: nuevoNombre,
      descripcion: "Nuevo producto agregado",
      precio: parseFloat(nuevoPrecio),
      stock: 10,
      categoria: "General",
      proveedor: "Genérico",
      imagen: "https://via.placeholder.com/150?text=Sin+Imagen",
    };
    setProductos([...productos, nuevoProducto]);
    setNuevoNombre("");
    setNuevoPrecio("");
    alert("¡Producto agregado!");
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Catálogo de Productos</h1>
          <p className="text-gray-500">Herramientas, Lubricantes SHELL y Repuestos</p>
        </div>
        <Link
          href="/sales/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Nueva Venta
        </Link>
      </div>

      {/* Sección de agregar producto rápido */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Producto Rápido</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej: Filtro de Aceite"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              value={nuevoPrecio}
              onChange={(e) => setNuevoPrecio(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={agregarProducto}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Tabla de Productos con Imágenes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        className="h-full w-full object-cover"
                        src={prod.imagen}
                        alt={prod.nombre}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=Error+Img';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{prod.nombre}</div>
                      <div className="text-sm text-gray-500">{prod.descripcion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    {prod.proveedor}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {prod.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                  {formatPrice(prod.precio)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prod.stock} u.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}