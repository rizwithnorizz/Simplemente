import { X } from "lucide-react";
import api from "../utils/axios.js";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import config from '../config/config.js';
const EditProduct = ({
  fetchProduct,
  isOpen,
  onClose,
  onConfirm,
  editProd,
  category,
  id,
}) => {
  const [formData, setFormData] = useState({
    name: editProd?.name || "",
    category: editProd?.category || "",
    orig_price: editProd?.orig_price || 0,
    quantity: editProd?.quantity || 0,
    image: null,
  });
  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('category', formData.category._id);
      form.append('orig_price', formData.orig_price);
      form.append('quantity', formData.quantity);
      if (formData.image) {
        form.append('image', formData.image);
      }

      await api.put(`/api/product/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onConfirm();
      toast.success("Successfully updated!");
    } catch (error) {
      console.log("Error encountered: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/api/product/${id}`);
      toast.success("Successfully deleted!");
      fetchProduct();
      onClose();
    } catch (error) {
      toast.error("Error encountered!");
      console.log(error);
    }
  };
  useEffect(() => {
    if (editProd) {
      setFormData({
        name: editProd.name || "",
        category: editProd.category || "",
        orig_price: editProd.orig_price || 0,
        quantity: editProd.quantity || 0,
        image: editProd.image || null,
      });
    }
  }, [editProd]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-[998] opacity-30 bg-black" />

      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="max-h-2/3 w-2/3 bg-white rounded-xl p-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold text-pink-500">Edit Product</h2>
            <button onClick={onClose}>
              <X className=" text-red-500 text-xl  hover:text-red-200" />
            </button>
          </div>
          <div className="flex gap-4 md:grid md:grid-cols-2 flex-col relative">
            <div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0"
              />
              {formData.image ? (
                <img
                  src={`${config.imageUrl}/${formData.image}`}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center cursor-pointer">
                  Choose Image
                </div>
              )}
            </div>
            <div className="relative h-full w-full">
              <div>
                <label
                  htmlFor="name"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-primary font-bold p-2 border-primary border rounded-xl w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category._id}
                  onChange={handleInputChange}
                  className="text-primary font-bold p-2 border-primary border rounded-xl w-full"
                >
                  {category.length > 0 &&
                    category.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="orig_price"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="orig_price"
                  name="orig_price"
                  value={formData.orig_price}
                  onChange={handleInputChange}
                  className="text-primary font-bold p-2 border-primary border rounded-xl w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="markup"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="text-primary font-bold p-2 border-primary border rounded-xl w-full"
                />
              </div>
              
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary text-white w-full"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-accent text-white w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
