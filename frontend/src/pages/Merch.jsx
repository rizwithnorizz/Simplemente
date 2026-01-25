import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddMerch from "../components/AddMerch.jsx";
import EditMerch from "../components/EditMerch.jsx";
import config from "../config/config.js";
const Merch = () => {
  document.title = "Merch";
  const location = useLocation();
  const [addMerchModal, setMerchModal] = useState(false);
  const eventPathMatch = location.pathname.match(/^\/event\/([^/]+)/);
  const currentEventID = eventPathMatch ? eventPathMatch[1] : null;
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const [editModal, setEditModal] = useState(false);
  const fetchProducts = async () => {
    try {
      const res = await api.get(`/api/merch/${currentEventID}`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [filtered, setFiltered] = useState([]);
  const [currCat, setCurrCat] = useState("");
  const [search, setSearch] = useState("");
  const filterData = () => {
    const filter = products.filter((item) => {
      const matchCategory =
        currCat === "" || item.product.category?.name === currCat;
      const matchSearch = item.product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
    setFiltered(filter);
  };
  const [category, setCategory] = useState([]);
  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/category");
      setCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    filterData();
  }, [currCat, search, products]);

  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, []);

  return (
    <Layout>
      <h1 className="font-bold text-pink-500 text-4xl mb-4">Merch</h1>
      <button
        onClick={() => {
          setMerchModal(true);
        }}
        className="btn btn-primary text-white min-w-min ml-4"
      >
        Add Product to Showcase
      </button>
      <input
        type="text"
        placeholder="Search Product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered w-full max-w-xs ml-4"
      />
      <select
        className="select select-bordered w-full max-w-xs ml-4"
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
      <div className="h-screen rounded-lg p-4 overflow-y-auto flex justify-between gap-4">
        <div className=" w-full">
          <div className="hidden sm:grid sm:grid-cols-5 w-full sm:gap-10 items-center mb-2 px-3">
            <span className="font-medium text-center">Quantity</span>
            <span className="font-medium  text-center text-primary">
              Product
            </span>
            <span className="font-medium text-center text-accent">
              Category
            </span>
            <span className="font-medium text-center text-primary">Price</span>
            <span className="font-medium text-center">Actions</span>
          </div>
          {filtered.map((item, index) => (
            <div
              key={item._id}
              tabIndex={0}
              className="bg-white rounded-xl collapse collapse-sm mb-2"
              onFocus={() => setCurrentProduct(item)}
            >
              <div className="p-2 hover:opacity-80 ">
                <div className="sm:grid sm:grid-cols-5 flex flex-col sm:gap-10 items-center">

                  <span className="font-medium text-center ">
                    {item.quantity}
                  </span>
                  <span className="font-medium text-center text-primary">
                    {item.product.name.toUpperCase()}
                  </span>

                  <span className="font-medium text-center text-accent">
                    {item.product.category?.name || "No category"}
                  </span>
                  <span className="font-medium text-center text-primary">
                    ₱{item.product.orig_price || 0}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditModal(true);
                    }}
                    className="btn btn-primary text-white "
                  >
                    Edit
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
        <div className="w-full max-w-md ">
          <div className="bg-white rounded-xl p-5 flex flex-col justify-center items-center">
            {currentProduct ? (
              <>
                {currentProduct.product.image ? (
                  <img
                    src={`${config.imageUrl}/${currentProduct.product.image}`}
                    alt={currentProduct.product.image}
                    className="h-3/4 w-3/4 object-cover rounded-xl"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {currentProduct.product.name}
              </>
            ) : (
              "Choose Product"
            )}
          </div>
        </div>
      </div>
      <AddMerch
        isOpen={addMerchModal}
        onClose={() => setMerchModal(false)}
        onConfirm={() => {
          fetchProducts();
        }}
        showcase={products}
        event={currentEventID}
      />
      <EditMerch
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setCurrentProduct(null);
        }}
        onConfirm={() => {
          fetchProducts();
          setEditModal(false);
          setCurrentProduct(null);
        }}
        showcase={currentProduct}
        event={currentEventID}
      />
    </Layout>
  );
};

export default Merch;
