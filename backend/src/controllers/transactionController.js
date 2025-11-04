import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

// @desc    Crear nueva transacción
// @route   POST /api/transactions
// @access  Private/Admin
export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, reference, orderId, transactionDate, notes } = req.body;

    if (!type || !category || !amount || !description) {
      return res.status(400).json({ message: 'Por favor completa todos los campos requeridos' });
    }

    const transaction = await Transaction.create({
      type,
      category,
      amount,
      description,
      reference,
      orderId,
      userId: req.user.id,
      transactionDate: transactionDate || new Date(),
      notes
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener todas las transacciones con filtros
// @route   GET /api/transactions
// @access  Private/Admin
export const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const where = {};

    // Filtros
    if (req.query.type) {
      where.type = req.query.type;
    }

    if (req.query.category) {
      where.category = req.query.category;
    }

    // Filtro por rango de fechas
    if (req.query.startDate || req.query.endDate) {
      where.transactionDate = {};
      if (req.query.startDate) {
        where.transactionDate[Op.gte] = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        where.transactionDate[Op.lte] = new Date(req.query.endDate);
      }
    }

    const { rows: transactions, count: total } = await Transaction.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['transactionDate', 'DESC']],
      limit,
      offset
    });

    res.json({
      transactions,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener resumen financiero
// @route   GET /api/transactions/summary
// @access  Private/Admin
export const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate[Op.gte] = new Date(startDate);
      if (endDate) where.transactionDate[Op.lte] = new Date(endDate);
    }

    // Obtener todas las transacciones del período
    const transactions = await Transaction.findAll({ where });

    // Calcular totales
    let totalIncome = 0;
    let totalExpenses = 0;
    const incomeByCategory = {};
    const expensesByCategory = {};

    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      
      if (t.type === 'income') {
        totalIncome += amount;
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + amount;
      } else {
        totalExpenses += amount;
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + amount;
      }
    });

    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0;

    res.json({
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin: parseFloat(profitMargin),
      incomeByCategory,
      expensesByCategory,
      transactionCount: transactions.length,
      period: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener transacción por ID
// @route   GET /api/transactions/:id
// @access  Private/Admin
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar transacción
// @route   PUT /api/transactions/:id
// @access  Private/Admin
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    const { type, category, amount, description, reference, orderId, transactionDate, notes } = req.body;

    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.amount = amount || transaction.amount;
    transaction.description = description || transaction.description;
    transaction.reference = reference || transaction.reference;
    transaction.orderId = orderId !== undefined ? orderId : transaction.orderId;
    transaction.transactionDate = transactionDate || transaction.transactionDate;
    transaction.notes = notes !== undefined ? notes : transaction.notes;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar transacción
// @route   DELETE /api/transactions/:id
// @access  Private/Admin
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    await transaction.destroy();

    res.json({ message: 'Transacción eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Registrar venta automáticamente cuando se crea una orden
// @route   Función auxiliar
export const registerSaleTransaction = async (order, userId) => {
  try {
    await Transaction.create({
      type: 'income',
      category: 'sale',
      amount: order.totalPrice,
      description: `Venta - Orden #${order.id}`,
      reference: `ORDER-${order.id}`,
      orderId: order.id,
      userId: userId,
      transactionDate: new Date()
    });
  } catch (error) {
    console.error('Error al registrar transacción de venta:', error);
  }
};
