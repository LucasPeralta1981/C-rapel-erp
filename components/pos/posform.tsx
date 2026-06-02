'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { Plus, Minus, Search, ShoppingCart, Trash2, Printer, AlertTriangle } from 'lucide-react';
import { formatCurrency, getLowStockProducts } from '@/lib/utils';
import { getImage } from '@/lib/images';

export default function POSForm() {
  const { cart, selectedClient, setClient, addToCart, updateQty, removeItem, clearCart, subtotal, total, addNotification } = useAppStore();
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/entities?type=CUSTOMER_B2B,CUSTOMER_B2C').then(r => r.json())
    ]).then(([productsRes, clientsRes]) => {
      setProducts(productsRes);
      setClients(clientsRes);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => 
    products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase())
    ), [products, search]);

  const lowStock = getLowStockProducts(products);

  const handleCheckout = async () => {
    if (!selectedClient) {
      addNotification('error', 'Seleccione un cliente');
      return;
    }
    if (cart.length === 0) {
      addNotification('error', 'Carrito vacío');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient.id,
          items: cart.map(c => ({
            productId: c.product.id,
            quantity: c.quantity,
            unitPrice: c.product.salePrice,
            subtotal: c.quantity * c.product.salePrice
          })),
          total: total,
          discount: 0,
          paymentMethod: 'EFECTIVO'
        })
      });

      if (res.ok) {
        const saleId = res.headers.get('sale-id');
        addNotification('success', 'Venta realizada con éxito');
        clearCart();
        window.open(`/api/sales/${saleId}/print`, '_blank');
      } else {
        addNotification('error', 'Error al procesar venta');
      }
    } catch (e) {
      addNotification('error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Catálogo */}
      <div className="w-2/3 p-6 overflow-y-auto">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {lowStock.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-700">
            <AlertTriangle size={20} />
            <span className="font-semibold">{lowStock.length} productos con stock bajo. Revisar inventario.</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map(p => {
            const isLow = p.stock <= (p.minStock || 5);
            return (
              <button 
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={p.stock === 0 || loading}
                className={`p-4 rounded-lg border-2 text-left transition-all relative overflow-hidden ${
                  p.stock === 0 ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div className="absolute top-2 right-2">
                   {isLow && <AlertTriangle size={16} className="text-red-500" />}
                </div>
                <img 
                  src={getImage(p.brand, p.sku)} 
                  alt={p.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
                <div className="font-bold text-gray-800 truncate text-sm">{p.name}</div>
                <div className="text-xs text-gray-500">{p.sku}</div>
                <div className="text-lg font-bold text-blue-600 mt-2">{formatCurrency(p.salePrice)}</div>
                <div className={`text-xs font-medium ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                  Stock: {p.stock}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-1/3 bg-white p-6 shadow-xl flex flex-col">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800">
          <ShoppingCart className="text-blue-600" /> Carrito
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700">Cliente</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedClient?.id || ''}
            onChange={e => setClient(clients.find(c => c.id === e.target.value) || null)}
          >
            <option value="">Seleccione cliente...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8 italic">Carrito vacío</p>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <img src={getImage(item.product.brand, item.product.sku)} className="w-10 h-10 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{item.product.name}</div>
                  <div className="text-xs text-gray-500">{item.product.sku}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.product.sku, -1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><Minus size={14} /></button>
                  <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.sku, 1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><Plus size={14} /></button>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800 text-sm">{formatCurrency(item.quantity * item.product.salePrice)}</div>
                  <button onClick={() => removeItem(item.product.sku)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-lg font-bold text-slate-800">
            <span>Total:</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || !selectedClient || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            {loading ? 'Procesando...' : <><Printer size={20} /> Finalizar Venta</>}
          </button>
        </div>
      </div>
    </div>
  );
}