import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";
import { connectDB } from "./config/db.js";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import merchRoutes from "./routes/merchRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";


const app = express();
const PORT = process.env.PORT || 5001;
connectDB().then(() => {
    app.listen(5001, '0.0.0.0', () => {
        console.log("Server started on PORT: 5001");
    });
});

app.use(cors());

app.use(express.json());
app.use(rateLimiter);

app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/event", eventRoutes);
app.use("/merch", merchRoutes);
app.use("/sale", saleRoutes);