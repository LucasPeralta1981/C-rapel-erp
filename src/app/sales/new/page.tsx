// src/app/sales/new/page.tsx
export default function NewSalePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Nueva Venta</h1>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Producto</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>
        <button 
          type="button" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Venta
        </button>
      </form>
    </div>
  );
}
