import mongoose from "mongoose";


const invoiceSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: false
        },
        price: {
            type: Number,
            required: false,
        },
        quantity: {
            type: Number,
            required: false,
            default: 1
        }
    }]
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;