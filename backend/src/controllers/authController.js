import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar campos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Por favor completa todos los campos' });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt - Request body:', req.body);
    console.log('📧 Email recibido:', email);
    console.log('🔑 Password recibido (longitud):', password?.length);

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor ingresa email y contraseña' });
    }

    // Buscar usuario (Sequelize no tiene select, se obtiene el password por defecto)
    const user = await User.findOne({ where: { email } });
    
    console.log('� Usuario encontrado:', !!user);
    if (user) {
      console.log('📝 Usuario datos:', { id: user.id, email: user.email, role: user.role });
      console.log('🔒 Password hash en DB:', user.password?.substring(0, 20) + '...');
    }

    if (!user) {
      console.log('❌ Usuario NO encontrado para email:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si está activo
    if (!user.isActive) {
      console.log('⚠️ Usuario desactivado');
      return res.status(401).json({ message: 'Usuario desactivado' });
    }

    // Verificar password
    console.log('🔐 Comparando password...');
    const isMatch = await user.comparePassword(password);
    console.log('✅ Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.city = req.body.city || user.city;
      user.country = req.body.country || user.country;
      user.profileImage = req.body.profileImage || user.profileImage;
      
      // Mantener compatibilidad con campos antiguos de dirección
      if (req.body.addressStreet) user.addressStreet = req.body.addressStreet;
      if (req.body.addressCity) user.addressCity = req.body.addressCity;
      if (req.body.addressState) user.addressState = req.body.addressState;
      if (req.body.addressZipCode) user.addressZipCode = req.body.addressZipCode;
      if (req.body.addressCountry) user.addressCountry = req.body.addressCountry;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        country: updatedUser.country,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
        phone: updatedUser.phone,
        address: updatedUser.toJSON().address,
        token: generateToken(updatedUser.id)
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
