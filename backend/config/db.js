import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use reliable public DNS servers for SRV record resolution.
// Many ISP/corporate DNS servers refuse SRV queries, breaking mongodb+srv:// URIs.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const connectDB = async (retries = 1) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    // Diagnostic: show the real connection target
    const uri = process.env.MONGODB_URI || '';
    const isAtlas = uri.includes('mongodb+srv://') || uri.includes('.mongodb.net');
    const dbName = conn.connection.name || '(default: test)';
    const hosts = conn.connection.client?.options?.hosts?.map(h => `${h.host}:${h.port}`).join(', ') || conn.connection.host;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'} connected`);
    }

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);

    if (retries > 0) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔁 Retrying... (${retries} attempts left)`);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectDB(retries - 1);
    } else {
      console.error('❌ All retries failed. Exiting...');
      process.exit(1);
    }
  }
};

export default connectDB;