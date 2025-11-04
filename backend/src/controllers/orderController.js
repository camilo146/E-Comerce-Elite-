import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { registerSaleTransaction } from './transactionController.js';

// @desc    Crear nueva orden
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No hay productos en la orden' });
    }

    // Verificar stock de productos
    for (const item of orderItems) {
      const product = await Product.findByPk(item.product);
      if (!product) {
        return res.status(404).json({ message: `Producto ${item.name} no encontrado` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` 
        });
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      orderItems,
      shippingStreet: shippingAddress.street || shippingAddress.address || '',
      shippingCity: shippingAddress.city || '',
      shippingState: shippingAddress.state || '',
      shippingZipCode: shippingAddress.zipCode || '',
      shippingCountry: shippingAddress.country || 'Colombia',
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'pending'
    });

    // Reducir stock de productos
    for (const item of orderItems) {
      const product = await Product.findByPk(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Registrar transacción de venta automáticamente
    await registerSaleTransaction(order, req.user.id);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Obtener orden por ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (order) {
      // Solo el usuario dueño o admin puede ver la orden
      if (order.userId === req.user.id || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'No autorizado para ver esta orden' });
      }
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener mis órdenes
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener todas las órdenes
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.isPaid) {
      where.isPaid = req.query.isPaid === 'true';
    }

    const { rows: orders, count: total } = await Order.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar orden a pagada
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        updateTime: req.body.update_time,
        emailAddress: req.body.payer?.email_address
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar estado de orden
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      const { status } = req.body;
      
      // Validar estados permitidos
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Estado inválido' });
      }

      order.status = status || order.status;
      
      // Si se marca como procesando o enviado, marcar como pagado
      if (status === 'processing' || status === 'shipped') {
        order.isPaid = true;
        if (!order.paidAt) order.paidAt = new Date();
      }
      
      // Si se marca como entregado
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.isPaid = true;
        if (!order.paidAt) order.paidAt = new Date();
      }

      if (req.body.notes) {
        order.notes = req.body.notes;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancelar orden
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Solo el usuario dueño o admin puede cancelar
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para cancelar esta orden' });
    }

    // No se puede cancelar si ya fue entregada
    if (order.isDelivered) {
      return res.status(400).json({ message: 'No se puede cancelar una orden ya entregada' });
    }

    order.status = 'cancelled';

    // Devolver stock a productos
    for (const item of order.orderItems) {
      const product = await Product.findByPk(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
