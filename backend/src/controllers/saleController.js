import Event from '../models/Event.js';
import Sale from '../models/Sale.js';


export async function transact(req, res){
    const { id } = req.params;
    const { products } = req.body;

    try{
        const event = await Event.findById(id);

        if (!event){
            return res.status(404).json({ message: "Event not found" });
        }

        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Products must be an array" });
        }
        for (const item of products){
            const merchItem = event.showcase.find(sItem => sItem._id.toString() === item.product);
            console.log(merchItem);
            if(merchItem){
                if(merchItem.quantity < item.quantity){
                    return res.status(400).json({ message: `Insufficient stock for product ${merchItem.product}` });
                }
                console.log("Sufficient stock, proceeding...");
                merchItem.quantity -= item.quantity;

            } else {
                return res.status(400).json({ message: `Product ${item.product} not found in showcase` });
            }
        }

        await event.save();

        let sale = await Sale.findOne({ event: id });
        if (sale){
            console.log("Existing sale found, updating...");
            for (const item of products){
                const saleItem = sale.showcase.find(sItem => sItem.product.toString() === item.product);
                if (saleItem){
                    saleItem.quantity += item.quantity;
                } else {
                    sale.showcase.push({
                        product: item.product,
                        price: item.price,
                        quantity: item.quantity
                    });
                }   
            }
            await sale.save();
        } else {
            sale = new Sale({
                event: id,
                showcase: products.map(item => ({
                    product: item.product,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
            await sale.save();
        }
        res.status(200).json({ message: "Transaction successful", sale });
    }catch(error){
        console.error("Error processing transaction:", error);
        res.status(500).json({
            message: "Error processing transaction",
            error: error.message
        });
    }
}


export async function refund(req, res) {
    const { id } = req.params;
    const { products } = req.body;
    try {
        const event = await Event.findById(id);
        const sale = await Sale.findOne({ event: id });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        if (!sale) {
            return res.status(404).json({ message: "Sale record not found for this event" });
        }
        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Products must be an array" });
        }
        for (const item of products) {
            const saleItem = sale.showcase.find(sItem => sItem.product.toString() === item.product);
            if (saleItem) {
                if (saleItem.quantity < item.quantity) {
                    return res.status(400).json({ message: `Refund quantity exceeds sold quantity for product ${saleItem.product}` });
                }   
                saleItem.quantity -= item.quantity;
                if (saleItem.quantity === 0) {
                    sale.showcase = sale.showcase.filter(sItem => sItem.product.toString() !== item.product);
                }
                const merchItem = event.showcase.find(sItem => sItem.product.toString() === item.product);
                if (merchItem) {
                    merchItem.quantity += item.quantity;
                } else {
                    event.showcase.push({
                        product: item.product,  
                        quantity: item.quantity
                    });
                }   
            } else {
                return res.status(400).json({ message: `Product ${item.product} not found in sale record` });
            }
        }

        await sale.save();
        await event.save();
        res.status(200).json({ message: "Refund processed successfully", sale });
    } catch (error) {
        console.error("Error processing refund:", error);
        res.status(500).json({
            message: "Error processing refund",
            error: error.message
        });
    }
}
