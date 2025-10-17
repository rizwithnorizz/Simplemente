import Product from "../models/Product.js";
import Event from "../models/Event.js";
import upload from "../config/upload.js";

export const uploadImage = upload.single('image');

export async function getAllProduct(_, res) {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error encountered" });
    console.log(error.status, ": ", error);
  }
}

export async function createProduct(req, res) {
  try {
    const { name, category, orig_price, markup } = req.body;
    const image = req.file ? req.file.filename : null;
    const newProduct = new Product({ name, category, orig_price, markup, image });

    const saved = await newProduct.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error encountered" + error });
    console.log(error.status, ": ", error);
  }
}

export async function editProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, category, orig_price, markup } = req.body;

    if (!name || !category || !orig_price || !markup) {
      return res.status(400).json({ message: "Missing required fields" });
    } 

    const updateFields = { 
      name, 
      orig_price, 
      markup, 
      category,
      ...(req.file && { image: req.file.filename })
    };

    const update = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Successfully updated", update });
  } catch (error) {
    res.status(500).json({ message: "Error encountered" + error });
    console.log(error.status, ": ", error);
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log("Deleting");
  try {
    const deleteItem = await Product.findByIdAndDelete(id);
    if (!deleteItem) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Event.updateMany(
      { "showcase.product": id }, 
      { $pull: { showcase: { product: id } } } 
    );

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error encountered" + error });
    console.log(error.status, ": ", error);
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) { 
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error encountered" + error });
    console.log(error.status, ": ", error);
  } 
}
