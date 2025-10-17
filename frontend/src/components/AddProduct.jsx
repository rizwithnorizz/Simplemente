import React, { useEffect, useState } from "react";
import api from "../utils/axios.js";
import toast from "react-hot-toast";
import { X } from 'lucide-react';
const AddProduct = ({
  isOpen,
  onConfirm,
  onClose,
  fetchCategory,
  fetchProduct,
  category,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    orig_price: "",
    markup: "",
    image: null,
  });

  useEffect(() => {
    if (category.length > 0 && !formData.category) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        category: category[0]._id,
      }));
    }
  }, [category, formData.category]);

  const clearFormData = () => {
    setFormData({
      name: "",
      category: category.length > 0 ? category[0]._id : "", // Reset to first category
      orig_price: "",
      markup: "",
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      if(category.length === 0) {
        toast.error("Please add a category first.");
        return;
      }
      const form = new FormData();
      form.append('name', formData.name);
      form.append('category', formData.category);
      form.append('orig_price', formData.orig_price);
      form.append('markup', formData.markup);
      if (formData.image) {
        form.append('image', formData.image);
      }
      
      await api.post("/api/product/create", form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onConfirm();
      fetchCategory();
      fetchProduct();
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
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-500">Add New Product</h2>
            <button
              onClick={() => {
                onClose();
                clearFormData();
              }}
            >
              <X className=" text-red-500 text-xl  hover:text-red-200" />
            </button>
          </div>
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
            <div className="relative h-full w-full">
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
                  className="input input-sm w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-pink-500"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input input-sm w-full bg-gray-100"
                >
                  {category.length > 0 ? (
                    category.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option>No available categories</option>
                  )}
                </select>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
