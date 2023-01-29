import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  const conn = await mongoose.connect(process.env.MONGO_URI);
  // eslint-disable-next-line no-console
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

export default connectDB;
