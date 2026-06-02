export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getLowStockProducts = (products: any[]) => {
  return products.filter(p => p.stock != null && p.stock <= (p.minStock || 5));
};