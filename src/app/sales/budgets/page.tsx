'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Archive, 
  Trash2, 
  FileText, 
  Calendar, 
  DollarSign, 
  ArrowLeft, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

// Interfaz para un Presupuesto Guardado
interface Presupuesto {
  id: string;
  clienteNombre: string;
  fechaCreacion: string; // ISO String
  total: number;
  itemsCount: number;
  estado: 'Pendiente' | 'Archivado' | 'Convertido';
  items: any[]; // Podrías expandir esto si necesitas ver detalles
}

export default function BudgetsPage() {
  const router = useRouter();
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'archivados'>('pendientes');

  // Simulación de carga de datos (Esto vendría de tu API/BD)
  useEffect(() => {
    // Simulamos datos de prueba
    const datosSimulados: Presupuesto[] = [
      {
        id: '1',
        clienteNombre: 'Constructora Alpha',
        fechaCreacion: new Date(Date.now() - 86400000 * 2).toISOString(), // Hace 2 días
        total: 1500000,
        itemsCount: 5,
        estado: 'Pendiente',
        items: []
      },
      {
        id: '2',
        clienteNombre: 'Juan Pérez',
        fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString(), // Hace 5 días
        total: 450000,
        itemsCount: 2,
        estado: 'Pendiente',
        items: []
      },
      {
        id: '3',
        clienteNombre: 'Tech Solutions SpA',
        fechaCreacion: new Date(Date.now() - 86400000 * 10).toISOString(), // Hace 10 días
        total: 3200000,
        itemsCount: 12,
        estado: 'Archivado',
        items: []
      }
    ];

    // Simular delay de red
    setTimeout(() => {
      setPresupuestos(datosSimulados);
      setLoading(false);
    }, 800);
  }, []);

  // Filtrar lista
  const presupuestosFiltrados = presupuestos.filter(p => {
    if (filtro === 'todos') return true;
    if (filtro === 'pendientes') return p.estado === 'Pendiente';
    if (filtro === 'archivados') return p.estado === 'Archivado';
    return true;
  });

  // Ordenar por fecha (más reciente primero)
  presupuestosFiltrados.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

  // Acciones
  const eliminarPresupuesto = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este presupuesto? Esta acción no se puede deshacer.')) {
      setPresupuestos(prev => prev.filter(p => p.id !== id));
    }
  };

  const archivarPresupuesto = (id: string) => {
    setPresupuestos(prev => prev.map(p => 
      p.id === id ? { ...p, estado: 'Archivado' } : p
    ));
  };

  const convertirEnVenta = (id: string) => {
    // Aquí iría la lógica para recuperar los items y crear la venta
    alert(`Convirtiendo presupuesto ${id} en venta... (Simulación)`);
    // Opcional: Eliminarlo de la lista de pendientes o cambiar estado
    setPresupuestos(prev => prev.map(p => 
      p.id === id ? { ...p, estado: 'Convertido' } : p
    ));
    router.push('/sales/new'); // Redirigir a nueva venta (idealmente con los datos precargados)
  };

  const formatearFecha = (isoString: string) => {
    const fecha = new Date(isoString);
    return fecha.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const diasTranscurridos = (isoString: string) => {
    const fecha = new Date(isoString);
    const ahora = new Date();
    const diffTime = Math.abs(ahora.getTime() - fecha.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Presupuestos en Espera</h1>
              <p className="text-sm text-gray-500">Gestiona tus cotizaciones pendientes</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/sales/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FileText size={18} /> Nuevo Presupuesto
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        
        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFiltro('pendientes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filtro === 'pendientes' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltro('archivados')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filtro === 'archivados' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Archivados
            </button>
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filtro === 'todos' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todos
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Mostrando <span className="font-bold text-gray-800">{presupuestosFiltrados.length}</span> registros
          </div>
        </div>

        {/* Lista de Presupuestos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : presupuestosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800">No hay presupuestos encontrados</h3>
            <p className="text-gray-500 mt-2">
              {filtro === 'pendientes' 
                ? 'No tienes presupuestos pendientes de conversión.' 
                : 'No hay registros en esta categoría.'}
            </p>
            {filtro === 'pendientes' && (
              <button 
                onClick={() => router.push('/sales/new')}
                className="mt-6 text-blue-600 hover:underline font-medium"
              >
                Crear uno ahora
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {presupuestosFiltrados.map((presupuesto) => (
              <div 
                key={presupuesto.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{presupuesto.clienteNombre}</h3>
                      {presupuesto.estado === 'Pendiente' ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <Clock size={12} /> Pendiente
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <Archive size={12} /> Archivado
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Creado el: {formatearFecha(presupuesto.fechaCreacion)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Hace {diasTranscurridos(presupuesto.fechaCreacion)} días</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>{presupuesto.itemsCount} ítems</span>
                      </div>
                    </div>
                  </div>

                  {/* Total y Acciones */}
                  <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                      <div className="text-2xl font-bold text-green-700">
                        ${presupuesto.total.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      {presupuesto.estado === 'Pendiente' ? (
                        <>
                          <button
                            onClick={() => convertirEnVenta(presupuesto.id)}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                            title="Convertir en Venta"
                          >
                            <CheckCircle size={16} /> Venta
                          </button>
                          <button
                            onClick={() => archivarPresupuesto(presupuesto.id)}
                            className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                            title="Archivar"
                          >
                            <Archive size={16} /> Archivar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => eliminarPresupuesto(presupuesto.id)}
                          className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      )}
                      
                      <button
                        onClick={() => eliminarPresupuesto(presupuesto.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
