import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose.
 * Reads the connection URI from MONGODB_URI environment variable.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Error de conexión MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
