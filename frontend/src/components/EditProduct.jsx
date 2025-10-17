import { X } from "lucide-react";
import api from "../utils/axios.js";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
    category: editProd?.category?._id || editProd?.category || "",
    orig_price: editProd?.orig_price || "",
    markup: editProd?.markup || "",
    image: null,
  });
  const handleSubmit = async () => {
    console.log(id);
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('category', formData.category._id);
      form.append('orig_price', formData.orig_price);
      form.append('markup', formData.markup);
      if (formData.image) {
        form.append('image', formData.image);
      }

      const res = await api.put(`/api/product/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onConfirm();
      console.log(res.data);
    } catch (error) {
      console.log("Error encountered: ", error);
    }
  };

  useEffect(() => {
    if (editProd) {
      setFormData({
        name: editProd.name || "",
        category: editProd.category?._id || editProd.category || "",
        orig_price: editProd.orig_price || "",
        markup: editProd.markup || "",
        image: null,
      });
    }
  }, [editProd]);

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/api/product/${id}`);
      toast.success("Successfully deleted!");
      fetchProduct();
      onClose();
      console.log(res.data);
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
        orig_price: editProd.orig_price || "",
        markup: editProd.markup || "",
        image: null,
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
                  value={formData.category || "no-category"}
                  onChange={handleInputChange}
                  className="input input-sm w-full bg-gray-100"
                >
                  <option value="no-category" disabled>
                    No category set
                  </option>
                  {category.length > 0 &&
                    category.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
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

                <div className="flex justify-between gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary text-white w-1/3"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-warning text-white w-1/3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
