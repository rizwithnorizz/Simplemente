import React, { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import api from "../utils/axios.js";
import toast from "react-hot-toast";
import config from "../config/config.js";
const EditMerch = ({ isOpen, onConfirm, onClose, showcase, event }) => {
  const [quant, setQuantity] = useState(0);
  const handleUpdate = async () => {
    try {
      await api.put(`/api/merch/${event}`, {
        product: showcase._id,
        quantity: quant,
      });
      toast.success("Successfully updated!");
      onConfirm();
    } catch (error) {
      console.log(error);
      toast.error("Error, could not update");
    }
  };

  const handleRemove = async () => {
    console.log(showcase);
    try {
      await api.delete(`/api/merch/${event}`, {
        data: { product: showcase.product._id },
      });
      toast.success("Successfully removed!");
      onConfirm();
    } catch (error) {
      console.log(error);
      toast.error("Error, could not remove");
    }
  };
  useEffect(() => {
    if (showcase) {
      setQuantity(showcase.quantity);
    }
  }, [showcase]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[998]" />

      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="max-h-2/3 w-2/3 bg-white rounded-xl p-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold text-pink-500">Edit Merch</h2>
            <button onClick={onClose}>
              <X className=" text-red-500 text-xl  hover:text-red-200" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {showcase.product.image ? (
              <img
                src={`${config.imageUrl}/${showcase.product.image}`}
                alt={showcase.product.image}
                className="h-3/4 w-3/4 object-cover rounded-xl"
              />
            ) : (
              <div className="bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="">
              <div className="flex flex-col">
                <span>Product Name</span>
                <input
                  disabled
                  className="text-primary font-bold p-2 border-primary border-2 rounded-xl"
                  value={showcase.product.name}
                />
              </div>
              <div className="flex flex-col">
                <span>Category</span>
                <input
                  disabled
                  className="text-primary font-bold p-2 border-primary border-2 rounded-xl"
                  value={showcase.product.category.name}
                />
              </div>
              <div className="flex flex-col">
                <span>Original Price</span>
                <input
                  disabled
                  className="text-primary font-bold p-2 border-primary border-2 rounded-xl"
                  value={` ₱` + showcase.product.orig_price}
                />
              </div>
              <div className="flex flex-col mt-2">
                <span>Markup Price</span>
                <input
                  disabled
                  className="text-primary font-bold p-2 border-primary border-2 rounded-xl"
                  value={` ₱` + showcase.product.markup}
                />
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-center">Quantity</span>
                <div className="flex gap-4 items-center justify-center">
                  <button
                    onClick={() => {
                      if (quant === 1) return;

                      handleQuantityChange(quant - 1);
                    }}
                    className="btn btn-primary btn-sm text-white"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    className="text-primary w-1/3 font-bold p-2 border-primary border-2 rounded-xl text-center"
                    value={quant}
                    onChange={(e) => {
                      if (quant < 0) return;

                      handleQuantityChange(parseInt(e.target.value) || 0);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleQuantityChange(quant + 1);
                    }}
                    className="btn btn-primary btn-sm text-white"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <button
                onClick={handleUpdate}
                className="btn btn-primary text-white w-full"
              >
                Update
              </button>
              <button
                onClick={handleRemove}
                className="btn btn-secondary text-white w-full mt-2"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMerch;
