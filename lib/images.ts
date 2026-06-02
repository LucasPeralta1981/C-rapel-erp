export const DEFAULT_IMAGES: Record<string, string> = {
  // EMTOP
  'EMTOP': 'https://images.unsplash.com/photo-1586864387907-6d5535764d74?auto=format&fit=crop&w=400&q=80',
  'HERRAMIENTA': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80',
  // SHELL
  'SHELL': 'https://images.unsplash.com/photo-1563720223185-11003d51d9c5?auto=format&fit=crop&w=400&q=80',
  'ACEITE': 'https://images.unsplash.com/photo-1563720223185-11003d51d9c5?auto=format&fit=crop&w=400&q=80',
  // DUNLOP
  'DUNLOP': 'https://images.unsplash.com/photo-1578844251758-2f714600b63c?auto=format&fit=crop&w=400&q=80',
  'NEUMATICO': 'https://images.unsplash.com/photo-1578844251758-2f714600b63c?auto=format&fit=crop&w=400&q=80',
  // Genérico
  'REPUSTO': 'https://images.unsplash.com/photo-1486262715619-01b8c2392780?auto=format&fit=crop&w=400&q=80',
  'GENERAL': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
};

export const getImage = (brand: string, sku: string = '') => {
  const brandKey = brand.toUpperCase();
  if (DEFAULT_IMAGES[brandKey]) return DEFAULT_IMAGES[brandKey];
  // Fallback a genérico
  return DEFAULT_IMAGES['GENERAL'];
};