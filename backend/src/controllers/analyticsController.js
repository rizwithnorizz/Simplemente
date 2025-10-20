import Invoice from '../models/Invoice.js';
import Event from '../models/Event.js';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
export async function getAnalytics(req, res) {
    try {
            const { eventId } = req.query;

        // Get all invoices
        const invoices = await Invoice.find()
            .populate('event')
            .populate('cart.product');

        // Calculate overall revenue
        const overallRevenue = invoices.reduce((total, invoice) => {
            return total + invoice.cart.reduce((subtotal, item) => {
                return subtotal + (item.price * item.quantity);
            }, 0);
        }, 0);

        // Calculate sales per event
        const eventSales = {};
        invoices.forEach(invoice => {
            if (invoice.event) {
                const eventName = invoice.event.name;
                const eventRevenue = invoice.cart.reduce((total, item) => {
                    return total + (item.price * item.quantity);
                }, 0);
                
                if (!eventSales[eventName]) {
                    eventSales[eventName] = 0;
                }
                eventSales[eventName] += eventRevenue;
            }
        });

        // Calculate product quantities sold and find best sellers
        // Some invoices may not have populated cart.product (or product was deleted).
        // Build a map of productId -> name from populated items, collect missing ids,
        // then batch-fetch missing Product docs.
        const productSales = {};
        const missingProductIds = new Set();

        invoices.forEach(invoice => {
            invoice.cart.forEach(item => {
                if (!item.product) return;

                // If populated, it will be an object with _id and name
                if (item.product && item.product._id && item.product.name) {
                    const productId = item.product._id.toString();
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            name: item.product.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    productSales[productId].quantity += item.quantity;
                    productSales[productId].revenue += item.price * item.quantity;
                } else {
                    // Not populated (likely an ObjectId or string) - collect id to fetch later
                    try {
                        const id = item.product.toString();
                        missingProductIds.add(id);
                        // Initialize counters so we can accumulate later
                        if (!productSales[id]) {
                            productSales[id] = {
                                name: null,
                                quantity: 0,
                                revenue: 0
                            };
                        }
                        productSales[id].quantity += item.quantity;
                        productSales[id].revenue += item.price * item.quantity;
                    } catch (e) {
                        // skip invalid id
                    }
                }
            });
        });

        // Batch fetch missing products to get their names
        if (missingProductIds.size > 0) {
            const ids = Array.from(missingProductIds);
            const foundProducts = await Product.find({ _id: { $in: ids } }).select('name');
            const foundMap = {};
            foundProducts.forEach(p => { foundMap[p._id.toString()] = p; });

            ids.forEach(id => {
                if (foundMap[id]) {
                    productSales[id].name = foundMap[id].name;
                } else {
                    // product was deleted - set a fallback name
                    productSales[id].name = `Deleted product (${id.slice(0,6)})`;
                }
            });
        }

        // Get events and sales
        let events = await Event.find().populate('showcase.product');
        if (eventId) {
            events = events.filter(event => event._id.toString() === eventId);
        }

        // Get all sales
        const sales = await Sale.find().populate('showcase.product');

        // Calculate remaining stock: initial - sold
        const productStock = {};
        events.forEach(event => {
            event.showcase.forEach(item => {
                if (item.product) {
                    const productId = item.product._id.toString();
                    let initialQty = item.quantity;
                    // Find sale for this event and product
                    const sale = sales.find(s => s.event.toString() === event._id.toString());
                    let soldQty = 0;
                    if (sale) {
                        const saleItem = sale.showcase.find(si => {
                            if (!si.product) return false;
                            return (si.product._id ? si.product._id.toString() : si.product.toString()) === productId;
                        });
                        if (saleItem) {
                            soldQty = saleItem.quantity;
                            initialQty += soldQty;
                        }
                    }

                    const remainingQty = initialQty - soldQty;

                    if (!productStock[productId]) {
                        productStock[productId] = {
                            name: (item.product && item.product.name) ? item.product.name : `Deleted product (${productId.slice(0,6)})`,
                            initialStock: 0,
                            remaining: 0,
                            sold: 0,
                            eventStock: {}
                        };
                    }

                    productStock[productId].eventStock[event._id] = {
                        eventName: event.name,
                        initialStock: initialQty,
                        sold: soldQty,
                        remaining: remainingQty,
                        percentage: initialQty > 0 ? Math.round((remainingQty / initialQty) * 100) : 0
                    };

                    // Update totals
                    productStock[productId].initialStock += initialQty;
                    productStock[productId].remaining += remainingQty;
                    productStock[productId].sold += soldQty;
                }
            });
        });


        // Transform product sales into sorted array for best sellers
        const bestSellers = Object.values(productSales)
            .filter(product => product.quantity > 0)
            .sort((a, b) => b.quantity - a.quantity);

        // Calculate stock percentages
        const stockPercentages = Object.values(productStock)
            .map(product => {
                const totalPercentage = product.initialStock > 0
                    ? Math.round((product.remaining / product.initialStock) * 100)
                    : 0;

                return {
                    name: product.name,
                    totalPercentage,
                    remaining: product.remaining,
                    initialStock: product.initialStock,
                    sold: product.sold,
                    eventStock: product.eventStock
                };
            })
            .filter(item => item.initialStock > 0);

        // Get list of events for the frontend dropdown
        const eventList = events.map(event => ({
            id: event._id,
            name: event.name
        }));

        // Build per-event transaction arrays for event box charts
        // Map: eventId -> [{ amount, createdAt }]
        const eventTransactions = {};
        invoices.forEach(invoice => {
            if (invoice.event && invoice.event._id) {
                const eid = invoice.event._id.toString();
                if (!eventTransactions[eid]) eventTransactions[eid] = [];
                const amount = invoice.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                eventTransactions[eid].push({
                    amount,
                    createdAt: invoice.createdAt
                });
            }
        });

        res.status(200).json({
            overallRevenue,
            eventSales,
            bestSellers,
            stockPercentages,
            eventList: eventList,
            eventTransactions // eventId -> [{ amount, createdAt }]
        });

    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({ message: 'Error getting analytics', error: error.message });
    }
}