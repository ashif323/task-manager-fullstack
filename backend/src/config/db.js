const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Attempting MongoDB connection...');
  
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
    tls: true,
    dbName: 'taskmanager', // explicitly set db name
  });

  console.log('MongoDB connected:', mongoose.connection.host);
  console.log('Database name:', mongoose.connection.name);
};

module.exports = connectDB;