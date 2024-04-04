// server.js
import app from './app.js';
import connectDB from './Config/database.js';
import dotenv from "dotenv";
import cloudinary from "cloudinary";

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "src/config/config.env" });
}
// connecting to the database
connectDB();

// Connecting to the cloudnary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const startServer = async () => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

