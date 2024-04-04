// app.mjs
import express from 'express';
import dotenv from 'dotenv'
import fileUpload from "express-fileupload";
import associate from './Routes/AssociateRoute.js';


const app = express();

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "src/config/config.env" });
}

// Middleware
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    parseNested:true
  })
);



// Routes
app.use('/api/associate', associate);

export default app;
