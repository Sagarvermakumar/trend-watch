import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGOOSE_URI, {
      dbName: "VIRAL_CONTENT_ANALYSIS",
    });
    console.log(`Database Connected :  ${connection.host}`);
  } catch (error) {
    console.log(`Database not connected : ${error.message}`);
  }
};

export default connectDB;
