import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('\n✅ SQLite conectado exitosamente');
    
    // Sincronizar modelos con la base de datos
    // En desarrollo: sincroniza sin forzar la recreación de tablas
    await sequelize.sync();
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
export default connectDB;
