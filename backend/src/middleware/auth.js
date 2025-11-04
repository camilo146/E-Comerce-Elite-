import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario (en Sequelize el password se excluye en toJSON)
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'Usuario desactivado' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores' });
  }
};
