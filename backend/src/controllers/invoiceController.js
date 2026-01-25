import Invoice from '../models/Invoice.js';

export async function getAllInvoices(req, res) {
    try {
        const invoices = await Invoice.find()
            .populate({ path: 'event' })
                .populate({
                path: 'cart.product',
                populate: { path: 'category' }
            });
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Error fetching invoices', error: error.message });
    }
}