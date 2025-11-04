import User from './src/models/User.js';
import { sequelize } from './src/config/db.js';

async function testLogin() {
  try {
    await sequelize.authenticate();
    
    const email = 'admin@elite.com';
    const password = 'admin123';
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      process.exit(1);
    }
    
    console.log(`\n✅ Usuario encontrado: ${user.email}`);
    console.log(`🔒 Password hash: ${user.password.substring(0, 30)}...`);
    
    const isMatch = await user.comparePassword(password);
    console.log(`\n🔑 Contraseña "${password}" es correcta: ${isMatch ? '✅ SÍ' : '❌ NO'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();
