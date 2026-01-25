import React from "react";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import toast from 'react-hot-toast';
const AddEvent = ({ isOpen, onClose, onConfirm }) => {
  const [product, setProduct] = useState([
    {
      name: "",
      orig_price: "",
      category: {
        name: ""
      },
      added: false,
      quantity: 0,
    },
  ]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [currCat, setCurrCat] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    showcase: [],
  });

  const fetchProduct = async () => {
    try {
      const res = await api.get("/api/product");
      const productsWithDefaults = res.data.map((item) => ({
        ...item,
        addedQuantity: 0,
        added: false,
      }));
      console.log(productsWithDefaults);
      setProduct(productsWithDefaults);
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

  const handleCreateEvent = async () => {
    try {
      console.log(formData);
      await api.post("/api/event", {
        name: formData.name,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        showcase: formData.showcase || [],
      });
      toast.success("Successfully created event!");
      onConfirm();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProduct();
    fetchCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (item, value, index) => {
    const newProduct = [...product];
    newProduct[index] = {
      ...item,
      addedQuantity: item.addedQuantity + value,
      quantity: item.quantity - value
    };
    setProduct(newProduct);

  };

  const handleAdded = (item, value, index) => {
    const newProduct = [...product];
    newProduct[index] = {
      ...item,
      added: value,
    };
    setProduct(newProduct);
    if (value) {
      setFormData((prev) => ({
        ...prev,
        showcase: [
          ...prev.showcase,
          {
            product: item._id,
            addedQuantity: item.addedQuantity,
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        showcase: prev.showcase.filter(
          (showcase) => showcase.product !== item._id
        ),
      }));
    }
  };

  const filterData = () => {
    const filter = product.filter((item) => {
      const matchesSearch = search === "" || item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = currCat === "" || item.category.name === currCat;
      return !!matchesSearch && !!matchesCategory;
    });
    setFiltered(filter);
  };

  useEffect(() => {
    filterData();
  }, [search, product, currCat]);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[998]" />

      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-2/3 overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-500">
              Create a new Event
            </h2>
            <button
              onClick={onClose}
            >
              <X className=" text-red-500 text-xl  hover:text-red-200" />
            </button>
          </div>
          <div className="flex-col flex">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-pink-500"
            >
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-sm w-full bg-gray-100"
            />
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-pink-500"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="input input-sm w-full bg-gray-100"
            />
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-pink-500"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="input input-sm w-full bg-gray-100"
            />
            <div className="md:flex md:justify-between pt-2 pb-2">
              <h2
                htmlFor="showcase"
                className="block text-sm font-medium text-pink-500 pt-4"
              >
                Add to Showcase
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search product..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="border-accent border rounded-xl bg-transparent p-2 w-full"
                />
                <select
                  className="border-accent border rounded-xl p-2 text-accent w-full"
                  defaultValue=""
                  onChange={(e) => {setCurrCat(e.target.value)}}
                >
                  <option value="" >
                    Select Category
                  </option>
                  {category.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="max-h-[50svh] overflow-y-auto">
              {filtered.map((item, index) => (
                <div
                  key={item._id}
                  tabIndex={index}
                  className={`collapse collapse-sm border ${ item.added ? "bg-primary bg-opacity-10" : 'border-primary'} mb-1`}
                >
                  <div className="collapse-title sm:flex items-center sm:justify-between">
                    <div className="items-center gap-4 ">
                      <span>{item.name}</span>
                    </div>
                    <div className="flex sm:items-end gap-2">
                      <span className=" text-primary text-bold pr-2">
                          {item.category.name}
                        </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          if (item.addedQuantity === 0) {
                            toast.error("Quantity is zero!");
                            return;
                          }

                          handleProductChange(item, -1, index);
                        }}
                        className="p-1 bg-gray-100 rounded-xl"
                      >
                        <Minus size={18} />
                      </button>
                      <input
                        type="number"
                        className="input input-bordered input-sm md:w-14 w-8"
                        value={item.addedQuantity}
                        onChange={(e) => {
                          e.stopPropagation();

                          handleProductChange(
                            item,
                            parseInt(e.target.value) || 0,
                            index
                          );
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          if (item.quantity === 0){
                            toast.error("No more stock remaining!");
                            return;
                          }
                          handleProductChange(item, 1, index);
                        }}
                        className="p-1 bg-gray-100 rounded-xl"
                      >
                        <Plus size={18} />
                      </button>

                      <button
                        onClick={(e) => {
                          handleAdded(item, !item.added, index);
                        }}
                        className={`btn btn-sm text-white ${
                          item.added ? "btn-secondary" : "btn-primary"
                        }`}
                      >
                        {item.added ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                  <div className="collapse-content">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        Stocks remaining: {item.quantity}
                        <span className="text-sm text-gray-600">
                          Original Price: ₱{item.orig_price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCreateEvent}
                className="btn btn-primary text-white"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEvent;
