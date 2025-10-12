import Event from '../models/Event.js';


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
    const { eventID, productID, quantity} = req.body;
    try{
        const event = await Event.findById(eventID);
        event.showcase.push({
            product: productID,
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

}


export async function deleteShowcase(req, res){

}
