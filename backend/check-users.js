import User from './src/models/User.js';
import { sequelize } from './src/config/db.js';

async function checkUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    
    console.log('\n📊 Usuarios en la base de datos:\n');
    users.forEach(user => {
      console.log(`✉️  Email: ${user.email}`);
      console.log(`👤 Nombre: ${user.name}`);
      console.log(`🔑 Role: ${user.role}`);
      console.log(`🔒 Password (hash): ${user.password.substring(0, 20)}...`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsers();
