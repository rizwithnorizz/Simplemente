import Product from "../models/Product.js";
import Event from "../models/Event.js";

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
    const newProduct = new Product({ name, category, orig_price, markup });

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

    if (!name || !orig_price || !markup) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build update object, exclude category if null or undefined
    const updateFields = { name, orig_price, markup, category };
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

    // Remove the product from all event showcases
    await Event.updateMany(
      { "showcase.product": id }, // Find events where the product exists in the showcase
      { $pull: { showcase: { product: id } } } // Remove the entire object from the showcase array
    );

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error encountered" + error });
    console.log(error.status, ": ", error);
  }
}
