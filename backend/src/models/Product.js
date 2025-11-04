import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del producto es obligatorio' },
      len: { args: [1, 100], msg: 'El nombre no puede exceder 100 caracteres' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción es obligatoria' },
      len: { args: [1, 2000], msg: 'La descripción no puede exceder 2000 caracteres' }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'El precio no puede ser negativo' }
    }
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: { args: [0], msg: 'El precio original no puede ser negativo' }
    }
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Precio sin descuento (se muestra tachado cuando onSale=true)',
    validate: {
      min: { args: [0], msg: 'El precio de oferta no puede ser negativo' }
    }
  },
  category: {
    type: DataTypes.ENUM('mujer', 'hombre', 'mixta'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La categoría es obligatoria' }
    }
  },
  subcategory: {
    type: DataTypes.ENUM('camisas', 'pantalones', 'zapatos', 'accesorios', 'gorras', 'medias', 'descuentos'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La subcategoría es obligatoria' }
    }
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('images');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value || []));
    }
  },
  sizes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('sizes');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('sizes', JSON.stringify(value || []));
    }
  },
  colors: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('colors');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('colors', JSON.stringify(value || []));
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'El stock no puede ser negativo' }
    }
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  onSale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'El descuento no puede ser negativo' },
      max: { args: [100], msg: 'El descuento no puede ser mayor a 100' }
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'La valoración mínima es 0' },
      max: { args: [5], msg: 'La valoración máxima es 5' }
    }
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['category', 'subcategory'] },
    { fields: ['price'] },
    { fields: ['featured'] },
    { fields: ['onSale'] }
  ]
});

export default Product;
