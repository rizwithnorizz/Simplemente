import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";
import { connectDB } from "./config/db.js";
import path from "path";
import multer from 'multer';
dotenv.config();

const __dirname = path.resolve();
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import merchRoutes from "./routes/merchRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  app.listen(5001, () => {
    console.log("Server started on PORT: 5001");
  });
});



// Serve static files from the public directory
app.use('/Images', express.static(path.join(process.cwd(), 'src', 'public', 'Images')));

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors()
  );
}
app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/merch", merchRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}
