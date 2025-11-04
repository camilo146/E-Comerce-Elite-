import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Product from './Product.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  orderItems: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('orderItems');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('orderItems', JSON.stringify(value || []));
    }
  },
  shippingStreet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingZipCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCountry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'paypal', 'cash'),
    allowNull: false
  },
  paymentResult: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('paymentResult');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('paymentResult', value ? JSON.stringify(value) : null);
    }
  },
  itemsPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId', 'createdAt'] },
    { fields: ['status'] }
  ]
});

// Relaciones
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// Método personalizado para formato JSON
Order.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Reconstruir objeto shippingAddress
  values.shippingAddress = {
    street: values.shippingStreet,
    city: values.shippingCity,
    state: values.shippingState,
    zipCode: values.shippingZipCode,
    country: values.shippingCountry
  };
  
  delete values.shippingStreet;
  delete values.shippingCity;
  delete values.shippingState;
  delete values.shippingZipCode;
  delete values.shippingCountry;
  
  return values;
};

export default Order;
