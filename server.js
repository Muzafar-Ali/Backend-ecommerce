import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
dotenv.config();

//databse connection
connectDB();

const app = express();

//midllewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser())




//routes
import userRoutes from "./routes/userRoutes.js";
app.use("/api/v1/user", userRoutes);

app.get('/', (req, res) => {
    return res.status(200).send('Hello World!');
})

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})

