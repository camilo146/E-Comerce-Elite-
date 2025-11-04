import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';
import User from '../models/User.js';

const createAdmin = async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Sincronizar modelos
    await sequelize.sync();
    console.log('✅ Modelos sincronizados');

    // Eliminar TODOS los usuarios admin existentes
    const existingAdmins = await User.findAll({ where: { email: 'admin@elite.com' } });
    
    if (existingAdmins.length > 0) {
      await User.destroy({ where: { email: 'admin@elite.com' } });
      console.log(`🗑️  ${existingAdmins.length} usuario(s) admin anterior(es) eliminado(s)`);
    }

    // Crear usuario administrador (el hook beforeCreate hará el hash)
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@elite.com',
      password: 'admin123', // El hook lo hasheará automáticamente
      role: 'admin',
      phone: '3001234567',
      isActive: true
    });
    
    console.log('🔍 Hash generado por el hook:', admin.password.substring(0, 20) + '...');

    console.log('\n✅ Usuario administrador creado exitosamente');
    console.log('═══════════════════════════════════════════');
    console.log('📧 Email: admin@elite.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Nombre: Administrador');
    console.log('📱 Teléfono: 3001234567');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    process.exit(1);
  }
};

createAdmin();
