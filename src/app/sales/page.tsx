// src/app/sales/page.tsx
export default function SalesPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-blue-600">¡Página de Ventas Cargada!</h1>
      <p className="mt-4">Si ves esto, la ruta funciona.</p>
      <a href="/sales/new" className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded">
        Ir a Nueva Venta
      </a>
    </div>
  );
}