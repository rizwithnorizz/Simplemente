import React, { useState } from "react";
import api from "../utils/axios.js";
import toast from 'react-hot-toast';
const AddProduct = ({ isOpen, onConfirm, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    orig_price: "",
    markup: "",
    image: null,
  });

  const clearFormData = () => {
    setFormData({
        name: "",
        category: "",
        orig_price: "",
        markup: "",
        image: null,
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/product/create", {
        name: formData.name,
        category: formData.category,
        orig_price: formData.orig_price,
        markup: formData.markup,
      });
      console.log(res.data);
      onConfirm();
      toast.success("Added product successfully!");
    } catch (error) {
      toast.error("Error: ", error);
      console.error("Error creating product:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-[998]" />

      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="bg-white rounded-lg p-6 md:w-2.5/4 w-3/4">
          <h2 className="text-xl font-bold text-pink-500 mb-4">
            Add New Product
          </h2>
          <div className="flex gap-4 md:grid md:grid-cols-2 flex-col">
            {/* Image Upload Section */}
            <div>
              <div className="h-full w-full relative">
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
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center cursor-pointer">
                    Choose Image
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="relative h-full w-full" >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-pink-500"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-sm w-full bg-gray-100 "
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-pink-500"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input input-sm w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="orig_price"
                  className="block text-sm font-medium text-pink-500"
                >
                  Original Price
                </label>
                <input
                  type="number"
                  id="orig_price"
                  name="orig_price"
                  value={formData.orig_price}
                  onChange={handleInputChange}
                  className="input input-sm w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="markup"
                  className="block text-sm font-medium text-pink-500"
                >
                  Markup
                </label>
                <input
                  type="number"
                  id="markup"
                  name="markup"
                  value={formData.markup}
                  onChange={handleInputChange}
                  className="input input-sm w-full bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6 relative">
            <button
              onClick={() => {
                handleSubmit();
                clearFormData();
              }}
              className="btn btn-primary text-white w-24"
            >
              Create
            </button>
            <button
              onClick={() =>{ 
                onClose();
                clearFormData();
              }}
              className="btn btn-ghost text-pink-500 w-24"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
