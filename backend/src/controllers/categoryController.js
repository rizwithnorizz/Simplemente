import Category from "../models/Category.js";

export async function getAllCategory(_, res){
    try{
        const category = await Category.find();
        res.status(200).json(category);
    }catch(error){
        res.status(500).json({message: "Error encountered"});
        console.log(error.status, ": ", error);
    }
}

export async function createCategory(req, res){
    try{
        const {name} = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({ message: "Category already exists!" }); // Use 409 Conflict for existing resource
        }

        const newCategory = new Category({name});

        const saved = await newCategory.save();
        res.status(201).json(saved);
    }catch(error){
        res.status(500).json({messsage: "Error encountered"});
        console.log(error.status, ": ", error);
    }
}


export async function deleteCategory(req, res){
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({message: "Successfully deleted"});

    } catch (error) {
        res.status(500).json({message: "Error encountered"});
    }
}