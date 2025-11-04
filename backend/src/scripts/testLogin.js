import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';
import User from '../models/User.js';

const testLogin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // Buscar usuario admin
    const user = await User.findOne({ where: { email: 'admin@elite.com' } });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      process.exit(1);
    }

    console.log('📋 Información del usuario:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Password hash:', user.password);
    console.log('  isActive:', user.isActive);
    console.log('');

    // Test con bcrypt directo
    const testPassword = 'admin123';
    console.log('🔐 Testeando password:', testPassword);
    
    const directCompare = await bcrypt.compare(testPassword, user.password);
    console.log('  bcrypt.compare directo:', directCompare);
    
    const methodCompare = await user.comparePassword(testPassword);
    console.log('  user.comparePassword():', methodCompare);
    
    console.log('');
    
    if (directCompare && methodCompare) {
      console.log('✅ Las contraseñas coinciden correctamente');
    } else {
      console.log('❌ ERROR: Las contraseñas NO coinciden');
      console.log('   Esto indica un problema con el hash almacenado');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLogin();
