// Script para ver un producto de ejemplo
import Product from './src/models/Product.js';
import { sequelize } from './src/config/db.js';

async function checkProduct() {
  try {
    await sequelize.authenticate();
    
    const product = await Product.findOne();
    
    if (product) {
      console.log('\n📦 Producto de ejemplo:');
      console.log('ID:', product.id);
      console.log('Nombre:', product.name);
      console.log('Tallas:', product.sizes);
      console.log('Colores:', product.colors);
      console.log('\nTipo de colores:', typeof product.colors);
      if (product.colors && product.colors.length > 0) {
        console.log('Primer color:', product.colors[0]);
        console.log('Es string?', typeof product.colors[0] === 'string');
        console.log('Es objeto?', typeof product.colors[0] === 'object');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProduct();
