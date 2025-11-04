import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Filtros con sintaxis Sequelize
    const where = { isActive: true };

    if (req.query.category) {
      // Si buscan por "mujer" u "hombre", incluir también productos "mixta"
      if (req.query.category === 'mujer' || req.query.category === 'hombre') {
        where.category = {
          [Op.or]: [req.query.category, 'mixta']
        };
      } else {
        where.category = req.query.category;
      }
    }

    if (req.query.subcategory) {
      where.subcategory = req.query.subcategory;
    }

    if (req.query.featured) {
      where.featured = req.query.featured === 'true';
    }

    if (req.query.onSale) {
      where.onSale = req.query.onSale === 'true';
    }

    if (req.query.inStock) {
      where.inStock = req.query.inStock === 'true';
    }

    // Búsqueda por texto (SQLite usa LIKE en lugar de texto completo)
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    // Rango de precios
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) where.price[Op.gte] = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) where.price[Op.lte] = parseFloat(req.query.maxPrice);
    }

    // Ordenamiento con sintaxis Sequelize
    let order = [];
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          order = [['price', 'ASC']];
          break;
        case 'price_desc':
          order = [['price', 'DESC']];
          break;
        case 'name_asc':
          order = [['name', 'ASC']];
          break;
        case 'name_desc':
          order = [['name', 'DESC']];
          break;
        case 'newest':
          order = [['createdAt', 'DESC']];
          break;
        default:
          order = [['createdAt', 'DESC']];
      }
    } else {
      order = [['createdAt', 'DESC']];
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      order,
      limit,
      offset
    });

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener producto por ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product && product.isActive) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear producto
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    // Registrar gasto de inventario si tiene precio original y stock
    if (product.originalPrice && product.stock > 0) {
      const inventoryCost = parseFloat(product.originalPrice) * parseInt(product.stock);
      
      await Transaction.create({
        type: 'expense',
        category: 'inventory',
        amount: inventoryCost,
        description: `Compra de inventario - ${product.name}`,
        reference: `PRODUCT-${product.id}`,
        userId: req.user.id,
        transactionDate: new Date(),
        notes: `Stock inicial: ${product.stock} unidades a ${product.originalPrice} c/u`
      });
    }
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      const oldStock = product.stock;
      const oldOriginalPrice = product.originalPrice;
      
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      
      // Si aumentó el stock, registrar compra de inventario adicional
      const newStock = updatedProduct.stock;
      const stockDiff = newStock - oldStock;
      
      if (stockDiff > 0 && updatedProduct.originalPrice) {
        const inventoryCost = parseFloat(updatedProduct.originalPrice) * stockDiff;
        
        await Transaction.create({
          type: 'expense',
          category: 'inventory',
          amount: inventoryCost,
          description: `Reposición de inventario - ${updatedProduct.name}`,
          reference: `PRODUCT-${updatedProduct.id}`,
          userId: req.user.id,
          transactionDate: new Date(),
          notes: `Stock añadido: ${stockDiff} unidades a ${updatedProduct.originalPrice} c/u`
        });
      }
      
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Eliminar producto (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      product.isActive = false;
      await product.save();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener categorías únicas
// @route   GET /api/products/categories/all
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: { isActive: true },
      raw: true
    });
    res.json(categories.map(c => c.category));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
