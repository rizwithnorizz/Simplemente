import React from "react";
import { Minus, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/axios.js";
import toast from "react-hot-toast";
const AddMerch = ({ isOpen, onClose, onConfirm, showcase, event }) => {
  const [prod, setProd] = useState([
    {
      _id: "",
      name: "",
      orig_price: "",
      category: {
        name: "",
      },
      added: false,
      quantity: "",
    },
  ]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [currCat, setCurrCat] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await api.get("/api/product");
      const responseWithDefault = res.data.map((item) => {
        const existingItem = showcase?.find(
          (showcaseItem) => showcaseItem.product._id === item._id
        );
        return {
          ...item,
          addedQuantity: existingItem?.quantity || 0,
          added: !!existingItem,
        };
      });
      setProd(responseWithDefault);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/category");
      setCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdded = async (item, value) => {
    // optimistic update using product id (no reliance on filtered index)
    setProd((prev) =>
      prev.map((p) => (p._id === item._id ? { ...p, added: value } : p))
    );

    try {
      if (value) {
        await api.post(`/api/merch/${event}`, {
          product: item._id,
          quantity: item.addedQuantity,
        });
        await api.put(`/api/product/${item._id}`, {
          name: item.name,
          category: item.category,
          orig_price: item.orig_price,
          quantity: item.quantity
        });
        toast.success("Successfully added!");
      } else {
        const res = await api.delete(`/api/merch/${event}`, {
          data: { product: item._id },
        });
        toast.success("Successfully removed!");
      }
      onConfirm();
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  const quantityChange = (itemId, value) => {
    setProd((prev) =>
      prev.map((p) =>
        p._id === itemId ? { ...p, addedQuantity: Math.max(0, p.addedQuantity + value), quantity: Math.max(0, p.quantity - value) } : p
      )
    );
  };
  const filterData = () => {
    const filter = prod.filter((item) => {
      const matchesSearch =
        search === "" || item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = currCat === "" || item.category.name === currCat;
      return !!matchesSearch && !!matchesCategory;
    });
    setFiltered(filter);
  };
  useEffect(() => {
    if (isOpen) {
      fetchProduct();
      fetchCategory();
    }
  }, [isOpen, showcase]);

  useEffect(() => {
    filterData();
  }, [search, prod, currCat]);

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[998]" />

      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-500">Add Showcase</h2>
            <button onClick={onClose}>
              <X className="text-red-500 text-xl hover:text-red-200" />
            </button>
          </div>

          <div className="md:flex md:justify-between pt-2 pb-2">
            <h2 className="block text-sm font-medium text-pink-500 pt-4">
              Add to Showcase
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-accent border rounded-xl bg-transparent p-2 w-full"
              />
              <select
                className="border-accent border rounded-xl p-2 text-accent w-full"
                defaultValue=""
                onChange={(e) => setCurrCat(e.target.value)}
              >
                <option value="">All Categories</option>
                {category.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {filtered
              .filter((item) => !item.added)
              .map((item, index) => (
                <div
                  key={item._id}
                  tabIndex={0}
                  className={`collapse collapse-sm border border-primary mb-1`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h2>{item.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-primary pr-2">
                          {item.category.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.addedQuantity === 0){
                              toast.error("Item quantity is zero");
                              return;
                            }
                            quantityChange(item._id, -1);
                          }}
                          className="btn btn-accent btn-sm text-white"
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          type="number"
                          className="input input-bordered input-sm w-20"
                          value={item.addedQuantity}
                          onChange={(e) => {
                            e.stopPropagation();
                            quantityChange(
                              item._id,
                              parseInt(e.target.value) || 0
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.quantity <= 0) {
                              toast.error("No more stocks remaining");
                              return;
                            } else {
                              quantityChange(item._id, 1);

                            }
                          }}
                          className="btn btn-accent btn-sm text-white"
                        >
                          <Plus size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdded(item, true);
                          }}
                          className="btn btn-sm w-20 text-white btn-primary"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="collapse-content">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {item.quantity} items remaining
                        </span>
                        <span className="text-sm text-gray-600">
                          Price: ₱{item.orig_price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMerch;
