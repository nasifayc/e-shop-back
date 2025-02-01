import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL;
    console.log("MongoURL: " + mongoURL);
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected");
  } catch (e) {
    console.error(`Database Connection error: ${e.message}`);
    process.exit(1);
  }
};

export default connectDB;
