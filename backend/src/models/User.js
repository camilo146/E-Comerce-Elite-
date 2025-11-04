import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Por favor ingresa un email válido' },
      notEmpty: { msg: 'El email es obligatorio' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es obligatoria' },
      len: { args: [6, 255], msg: 'La contraseña debe tener al menos 6 caracteres' }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'https://via.placeholder.com/150'
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressStreet: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressCity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressState: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressZipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressCountry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método para comparar passwords
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener objeto sin password
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  
  // Reconstruir objeto address
  if (values.addressStreet || values.addressCity) {
    values.address = {
      street: values.addressStreet,
      city: values.addressCity,
      state: values.addressState,
      zipCode: values.addressZipCode,
      country: values.addressCountry
    };
    delete values.addressStreet;
    delete values.addressCity;
    delete values.addressState;
    delete values.addressZipCode;
    delete values.addressCountry;
  }
  
  return values;
};

export default User;
