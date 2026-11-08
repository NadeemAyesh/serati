const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = (
      process.env.MONGODB_URI || 
      process.env.MONGO_URL || 
      process.env.MONGODB_URL || 
      'mongodb://127.0.0.1:27017/seerati_cv_db'
    ).trim();
    
    // Remove wrapping quotes if added by mistake in environment settings
    if ((mongoUri.startsWith('"') && mongoUri.endsWith('"')) || (mongoUri.startsWith("'") && mongoUri.endsWith("'"))) {
      mongoUri = mongoUri.slice(1, -1).trim();
    }

    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      console.error(`⚠️ MONGODB_URI does not start with "mongodb://" or "mongodb+srv://". Value received: "${mongoUri.substring(0, 15)}..."`);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
