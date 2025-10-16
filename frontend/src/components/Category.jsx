import React, { useState, useEffect } from "react";
import api from "../utils/axios.js";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
const Category = ({ onClose, onConfirm, isOpen, fetchCategory, category }) => {
  const handleAddCategory = async () => {
    try {
      await api.post("/api/category/create", {
        name: addCat,
      });
      toast.success("Created a new category!");
      fetchCategory();
    } catch (error) {
      if (error.status === 409) {
        toast.error("Category already exists");
      }
    }
  };

  const handleDelete = async (e) => {
    try {
      await api.delete(`/api/category/${e._id}`);
      fetchCategory();
      toast.success("Category deleted!");
    } catch (error) {
      toast.error("Error: ", error.status);
    }
  }
  const [addCat, setAddCat] = useState("");
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-[998]" />
      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="bg-white rounded-lg p-6 md:w-2/4 w-3/4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-500">
              Manage Categories
            </h2>
            <button
              onClick={() => {
                onClose();
              }}
            >
              <X className=" text-red-500 text-xl  hover:text-red-200" />
            </button>
          </div>
          <div className="flex justify-between">
            <input
              type="text"
              placeholder="Add new category..."
              className="w-full rounded-xl p-2 input-primary mb-1 mr-2"
              onChange={(e) => {
                setAddCat(e.target.value);
              }}
            />
            <button
              onClick={() => {
                handleAddCategory();
              }}
            >
              <Plus className="mb-1" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="w-full table-auto border-collapse ">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className=" text-pink-500">Category</th>
                  <th className=" text-pink-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {category.map((item) => (
                  <tr key={item._id} className="text-center h-[5svh] border-b-2 border-pink-500">
                    <td>{item.name}</td>
                    <td>
                      <div 
                      className="btn btn-primary text-white btn-sm"
                      onClick={() => { handleDelete(item) }}>Delete</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
