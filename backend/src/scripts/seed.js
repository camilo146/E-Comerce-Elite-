import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { sequelize } from '../config/db.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@elite.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'user@elite.com',
    password: 'user123',
    role: 'user'
  }
];

const products = [
  {
    name: 'Sneakers Premium Air Max',
    description: 'Sneakers de edición limitada con tecnología Air Max. Diseño moderno y cómodo para uso diario.',
    price: 189.99,
    category: 'zapatos',
    subcategory: 'sneakers',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: [{ name: 'Negro', hex: '#000000' }, { name: 'Blanco', hex: '#FFFFFF' }],
    stock: 50,
    featured: true,
    brand: 'ÉLITE',
    tags: ['sneakers', 'deportivo', 'casual']
  },
  {
    name: 'Camisa Essential Slim Fit',
    description: 'Camisa de algodón orgánico con corte slim fit. Perfect para ocasiones formales o casuales.',
    price: 79.99,
    category: 'hombre',
    subcategory: 'camisas',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Azul', hex: '#0000FF' }, { name: 'Blanco', hex: '#FFFFFF' }],
    stock: 100,
    featured: true,
    brand: 'ÉLITE',
    tags: ['camisa', 'formal', 'casual']
  },
  {
    name: 'Bolso Signature Leather',
    description: 'Bolso de cuero genuino italiano. Diseño elegante con múltiples compartimentos.',
    price: 299.99,
    category: 'accesorios',
    subcategory: 'bolsos',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500'],
    colors: [{ name: 'Negro', hex: '#000000' }, { name: 'Marrón', hex: '#8B4513' }],
    stock: 25,
    featured: true,
    brand: 'ÉLITE',
    tags: ['bolso', 'cuero', 'lujo']
  },
  {
    name: 'Vestido Elegante Evening',
    description: 'Vestido elegante para toda ocasión. Tela premium con caída perfecta.',
    price: 149.99,
    category: 'mujer',
    subcategory: 'vestidos',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#000000' }, { name: 'Rojo', hex: '#FF0000' }],
    stock: 40,
    featured: true,
    brand: 'ÉLITE',
    tags: ['vestido', 'elegante', 'noche']
  },
  {
    name: 'Reloj Luxury Chronograph',
    description: 'Reloj de diseño exclusivo con movimiento suizo. Resistente al agua hasta 50m.',
    price: 399.99,
    category: 'accesorios',
    subcategory: 'relojes',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500'],
    colors: [{ name: 'Plateado', hex: '#C0C0C0' }, { name: 'Dorado', hex: '#FFD700' }],
    stock: 15,
    featured: false,
    brand: 'ÉLITE',
    tags: ['reloj', 'lujo', 'accesorios']
  },
  {
    name: 'Gafas de Sol Aviator',
    description: 'Gafas de sol con protección UV400. Estilo aviador clásico.',
    price: 159.99,
    category: 'accesorios',
    subcategory: 'gafas',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    colors: [{ name: 'Negro', hex: '#000000' }, { name: 'Dorado', hex: '#FFD700' }],
    stock: 60,
    featured: false,
    brand: 'ÉLITE',
    tags: ['gafas', 'sol', 'protección']
  },
  {
    name: 'Chaqueta Invierno Premium',
    description: 'Chaqueta térmica para invierno. Relleno de plumas naturales.',
    price: 89.99,
    originalPrice: 179.99,
    category: 'sale',
    subcategory: 'chaquetas',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Negro', hex: '#000000' }, { name: 'Azul', hex: '#0000FF' }],
    stock: 30,
    onSale: true,
    discount: 50,
    brand: 'ÉLITE',
    tags: ['chaqueta', 'invierno', 'oferta']
  },
  {
    name: 'Botas Cuero Chelsea',
    description: 'Botas Chelsea de cuero genuino. Diseño atemporal y versátil.',
    price: 119.99,
    originalPrice: 239.99,
    category: 'sale',
    subcategory: 'botas',
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500'],
    sizes: ['39', '40', '41', '42', '43'],
    colors: [{ name: 'Marrón', hex: '#8B4513' }, { name: 'Negro', hex: '#000000' }],
    stock: 20,
    onSale: true,
    discount: 50,
    brand: 'ÉLITE',
    tags: ['botas', 'cuero', 'oferta']
  },
  {
    name: 'Jeans Slim Fit Premium',
    description: 'Jeans de mezclilla premium con corte slim fit. Cómodos y duraderos.',
    price: 89.99,
    category: 'hombre',
    subcategory: 'pantalones',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [{ name: 'Azul', hex: '#0000FF' }, { name: 'Negro', hex: '#000000' }],
    stock: 80,
    brand: 'ÉLITE',
    tags: ['jeans', 'pantalones', 'casual']
  },
  {
    name: 'Blusa Elegante Seda',
    description: 'Blusa de seda natural con diseño elegante. Ideal para oficina.',
    price: 129.99,
    category: 'mujer',
    subcategory: 'blusas',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Negro', hex: '#000000' }],
    stock: 45,
    brand: 'ÉLITE',
    tags: ['blusa', 'seda', 'elegante']
  },
  {
    name: 'Cartera Premium Leather',
    description: 'Cartera de cuero italiano con múltiples compartimentos.',
    price: 129.99,
    category: 'accesorios',
    subcategory: 'carteras',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'],
    colors: [{ name: 'Negro', hex: '#000000' }, { name: 'Marrón', hex: '#8B4513' }],
    stock: 35,
    brand: 'ÉLITE',
    tags: ['cartera', 'cuero', 'accesorios']
  },
  {
    name: 'Sudadera Hoodie Premium',
    description: 'Sudadera con capucha de algodón premium. Perfecta para el día a día.',
    price: 69.99,
    category: 'hombre',
    subcategory: 'sudaderas',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Gris', hex: '#808080' }, { name: 'Negro', hex: '#000000' }],
    stock: 70,
    brand: 'ÉLITE',
    tags: ['sudadera', 'casual', 'cómoda']
  }
];

const importData = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('🗑️  Base de datos limpiada y sincronizada');

    // Crear usuarios (individualHooks para que se ejecuten los hooks de hash)
    await User.bulkCreate(users, { individualHooks: true });
    console.log('✅ Usuarios creados');

    // Crear productos
    await Product.bulkCreate(products);
    console.log('✅ Productos creados');

    console.log('🎉 Datos importados exitosamente');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await sequelize.authenticate();

    await Order.destroy({ where: {}, truncate: true });
    await Product.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });

    console.log('🗑️  Datos eliminados exitosamente');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
