import Product from "../models/Product.js";


export async function getAllProduct(_, res){
    try{
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    }catch(error){
        res.status(500).json({message: "Error encountered"});
        console.log(error.status, ": ", error);
    }
}

export async function createProduct(req, res){
    try{
        const {name, category, orig_price, markup} = req.body;
        const newProduct = new Product({name, category, orig_price, markup});
        
        const saved = await newProduct.save();
        res.status(200).json(saved);
    }catch(error){
        res.status(500).json({message: "Error encountered" + error});
        console.log(error.status, ": ", error);
    }
}