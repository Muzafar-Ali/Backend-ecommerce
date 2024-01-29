import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import connectDB from "./config/db.js";

//dotenv config
dotenv.config();


//databse connection
connectDB();

//cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const app = express();

//midllewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser())




//routes
import userRoutes from "./routes/userRoutes.js";
app.use("/api/v1/user", userRoutes);

import productRoutes from "./routes/productRoutes.js";
app.use("/api/v1/product", productRoutes);

import categoryRoutes from "./routes/categoryRoutes.js";
app.use("/api/v1/cat", categoryRoutes);


const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})

