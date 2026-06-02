// src/app/sales/page.tsx
export default function SalesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Lista de Ventas</h1>
      <p className="text-gray-600">Aquí verás el historial de ventas.</p>
      <a 
        href="/sales/new" 
        className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Nueva Venta
      </a>
    </div>
  );
}