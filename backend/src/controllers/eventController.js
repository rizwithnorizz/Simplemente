import Event from '../models/Event.js';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import Invoice from '../models/Invoice.js';

export async function getAllEvent(_, res) {
    try {
        const event = await Event.find();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error encountered " });
        console.log(error.status, ": ", error);
    }
}

export async function createEvent(req, res) {
    try {
        const { name, start_date, end_date, showcase } = req.body;
        const newEvent = new Event({
            name,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            showcase: showcase || []
        });
        const savedEvent = await newEvent.save();
        const populatedEvent = await Event.findById(savedEvent._id)
            .populate('showcase.product');
        res.status(201).json(populatedEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
}

export async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        const deleteEvent = await Event.findByIdAndDelete(id)
            .populate('showcase.product');

        if (!deleteEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Delete all sales and invoices associated with the event
        await Sale.deleteMany({ event: id });
        await Invoice.deleteMany({ event: id });

        // Return all showcase product quantities back to main product quantity
        for (const item of deleteEvent.showcase) {
            if (item.product && item.quantity != 0) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    { $inc: { quantity: item.quantity } }
                );
            }
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({
            message: "Error deleting event",
            error: error.message
        });
    }
}

export async function editEvent(req, res) {
    try {
        const { id } = req.params;
        const { name, start_date, end_date } = req.body;
        const find = await Event.findByIdAndUpdate(id,
            { name, start_date: new Date(start_date), end_date: new Date(end_date) },
            { new: true }
        );

        if (!find) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Successfully updated", find });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
}