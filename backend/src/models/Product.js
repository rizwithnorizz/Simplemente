import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
        required: false
    },
    orig_price: {
        type: Number,
        required: true
    },
    markup: {
        type: Number,
        required: true
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;