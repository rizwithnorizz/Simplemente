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
        const newCategory = new Category({name});

        const saved = await newCategory.save();
        res.status(200).json(saved);
    }catch(error){
        res.status(500).json({messsage: "Error encountered"});
        console.log(error.status, ": ", error);
    }
}