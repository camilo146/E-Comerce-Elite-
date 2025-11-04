// Script para actualizar productos existentes con el nuevo formato de colores
import Product from './src/models/Product.js';
import { sequelize } from './src/config/db.js';

const colorMapping = {
  'Negro': { name: 'Negro', hex: '#000000' },
  'Blanco': { name: 'Blanco', hex: '#FFFFFF' },
  'Gris': { name: 'Gris', hex: '#808080' },
  'Azul': { name: 'Azul', hex: '#0000FF' },
  'Rojo': { name: 'Rojo', hex: '#FF0000' },
  'Verde': { name: 'Verde', hex: '#00FF00' },
  'Amarillo': { name: 'Amarillo', hex: '#FFFF00' },
  'Rosa': { name: 'Rosa', hex: '#FFC0CB' },
  'Naranja': { name: 'Naranja', hex: '#FFA500' },
  'Morado': { name: 'Morado', hex: '#800080' },
  'Azul Marino': { name: 'Azul Marino', hex: '#000080' },
  'Beige': { name: 'Beige', hex: '#F5F5DC' }
};

async function updateProducts() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    const products = await Product.findAll();
    console.log(`\nEncontrados ${products.length} productos`);

    let updatedCount = 0;

    for (const product of products) {
      const colors = product.colors;
      
      // Verificar si los colores son strings (formato antiguo)
      if (colors && colors.length > 0) {
        const needsUpdate = colors.some(color => typeof color === 'string');
        
        if (needsUpdate) {
          // Convertir colores de string a objetos
          const newColors = colors.map(color => {
            if (typeof color === 'string') {
              return colorMapping[color] || { name: color, hex: '#808080' };
            }
            return color; // Ya es objeto
          });

          product.colors = newColors;
          await product.save();
          
          console.log(`✓ Actualizado: ${product.name}`);
          console.log(`  Colores: ${newColors.map(c => c.name).join(', ')}`);
          updatedCount++;
        }
      }
    }

    console.log(`\n✅ Actualización completa: ${updatedCount} productos actualizados`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateProducts();
