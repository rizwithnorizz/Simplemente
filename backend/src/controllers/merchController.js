import Event from '../models/Event.js';
import Product from '../models/Product.js';

export async function getShowcase(req, res) {
    const { id } = req.params;
    try {
        const event = await Event.findById(id)
            .populate({
                path: 'showcase.product',
                populate: {
                    path: 'category'
                }
            });
        res.status(200).json(event.showcase);
    }catch(error) {
        console.error("Error fetching showcase:", error);
        res.status(500).json({
            message: "Error fetching showcase",
            error: error.message
        });
    }   

}

export async function addNewShowcase(req, res){
    const { id } = req.params;
    const { product, quantity} = req.body;
    try{
        const event = await Event.findById(id);
        const prod = await Product.findById(product);

        if (!prod){
            return res.status(404).json({ message: "Product not found",id: prod });
        }

        if (!event){
            return res.status(404).json({ message: "Event not found" });
        }

        event.showcase.push({
            product: prod,
            quantity: quantity
        });

        const updatedEvent = await event.save();

        const populatedEvent = await Event.findById(updatedEvent._id)
            .populate({
                path: 'showcase.product',
                model: 'Product'
            });

        res.status(200).json(populatedEvent);
    }catch(error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            message: "Error adding product",
            error: error.message
        });
    } 
}

export async function updateShowcase(req, res){
    const { id } = req.params;
    const { product, quantity } = req.body
    try {
        const event = await Event.findById(id);
        event.showcase.id(product).quantity = quantity;
        await event.save();
        res.status(200).json({ message: "Successfully updated showcase" });
    } catch (error) {
        res.status(500).json({ message: "Error updating showcase", error: error.message });
    }
}


export async function deleteShowcase(req, res) {
    const { id } = req.params;
    const { product } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(
            id,
            { $pull: { showcase: { product: product } } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found ", id: product});
        }
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Successfully removed from showcase" });
    } catch (error) {
        console.error("Delete showcase error:", error);
        res.status(500).json({ 
            message: "Error removing from showcase", 
            error: error.message 
        });
    }
}
