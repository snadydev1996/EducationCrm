import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv.config();
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "src/config/config.env" });
  }

const connectDatabase = () => {
  const dbURI =process.env.DB_URI;
  if (!dbURI) {
    console.error("MongoDB URI is not provided in environment variables.");
    return;
  }

  mongoose
    .connect(dbURI, {
        
    })
    .then(() => {
      console.log(`Mongodb connected with server: ${mongoose.connection.host}`);
    })
    .catch(error => {
      console.error('MongoDB connection error:', error);
      process.exit(1); // Exit process with failure
    });
};

export default connectDatabase;
