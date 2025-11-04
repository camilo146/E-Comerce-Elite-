import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
    comment: 'income = ingreso, expense = gasto'
  },
  category: {
    type: DataTypes.ENUM(
      'sale', 'refund', 'other_income', // Ingresos
      'inventory', 'shipping', 'marketing', 'salary', 'rent', 'utilities', 'other_expense' // Gastos
    ),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Referencia a orden, factura, etc.'
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Referencia a orden si aplica'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['category'] },
    { fields: ['userId'] },
    { fields: ['transactionDate'] },
    { fields: ['orderId'] }
  ]
});

// Relación con User
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

export default Transaction;
