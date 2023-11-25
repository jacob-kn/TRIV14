import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // connect to databse using connection stirng in .env
    console.log(`MongoDb connected: ${conn.connection.host}`); // last part if from colors package to make it easier
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
