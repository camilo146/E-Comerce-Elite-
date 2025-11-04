/**
 * Formatea un precio a formato de moneda colombiana (COP)
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado (ej: $189.990)
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '$0';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
};

/**
 * Formatea un precio sin el símbolo de moneda
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado sin símbolo (ej: 189.990)
 */
export const formatPriceNumber = (price) => {
  if (!price && price !== 0) return '0';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
};
