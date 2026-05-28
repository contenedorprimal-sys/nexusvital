import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose.
 * Reads the connection URI from MONGODB_URI environment variable.
 */
const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Error de conexión MongoDB: ${err.message}`);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
      isConnected = false;
    });
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);
    // In serverless, we don't want to exit the process
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
