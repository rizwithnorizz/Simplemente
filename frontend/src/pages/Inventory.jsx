import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import { config } from "../config/config.js";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AddProduct from "../components/AddProduct.jsx";
import Category from "../components/Category.jsx";
import EditProduct from "../components/EditProduct.jsx";
const Inventory = () => {
  document.title = "Inventory";
  const [currCat, setCurrCat] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProd, setFilter] = useState([]);
  const [category, setCategory] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);

  const [focusProduct, setFocusProduct] = useState(null);
  const fetchProduct = async () => {
    try {
      const res = await api.get("/api/product");
      setProducts(res.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/category");
      setCategory(res.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const filterData = () => {
    const filtered = products.filter((item) => {
      const categoryMatch =
        currCat === "" || currCat == "Category" || (item.category && item.category.name === currCat);
      const nameMatch = item.name.toLowerCase().includes(searchProduct.toLowerCase());
      return categoryMatch && nameMatch;
    });
    setFilter(filtered);
  };

  useEffect(() => {
    fetchProduct();
    fetchCategory();
  }, []);

  useEffect(() => {
    filterData();
  }, [currCat, products, searchProduct]);

  return (
    <Layout>
      <h1 className="font-bold text-pink-500 text-4xl mb-4">Inventory</h1>
      <div
        className="btn btn-primary text-white ml-4"
        onClick={() => setAddModal(true)}
      >
        Add new Product
      </div>
      <input
        type="text"
        placeholder="Search product name..."
        className="input input-bordered input-md ml-2"
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
      />
      <select
        className="select select-md select-accent ml-2"
        defaultValue="Category"
        onChange={(e) => {
          setCurrCat(e.target.value);
          filterData();
        }}
      >
        <option>Category</option>
        {category.map((cat) => (
          <option key={cat._id}>{cat.name}</option>
        ))}
      </select>
      <div
        onClick={() => {
          setCatModal(true);
        }}
        className="btn bg-transparent hover:bg-transparent btn-sm ml-2"
      >
        +
      </div>
      <div className="flex w-full p-4 gap-4">
        <div className="w-full h-min flex-col rounded-xl">
          {filteredProd.map((item) => (
            <div
              key={item._id}
              onFocus={() => setFocusProduct(item)}
              tabIndex={0}
              className="collapse collapse-sm bg-white mb-2"
            >
              <div className="collapse p-4 flex justify-between">
                <span className="text-primary flex justify-center font-medium font-mono text-2xl">{item.name}</span>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setEditModal(true);
                  }}
                  className="btn btn-primary text-white "
                >
                  Edit
                </button>
              </div>
              <div className="collapse collapse-content">
                <table className="text-sm m-2 ">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Category:</td>
                      <td className="py-2 text-right font-medium">
                        {item.category && item.category.name !== null
                          ? item.category.name
                          : "No available category"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Stock:</td>
                      <td className="py-2 text-right font-medium">
                        {item.quantity}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-accent text-xl font-bold">
                        PRICE:
                      </td>
                      <td className="py-2 text-right text-accent text-xl font-bold">
                        ₱{item.orig_price}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <div className="w-1/2 h-min bg-white rounded-xl p-4 flex justify-center items-center">
          {focusProduct ? (
            focusProduct.image ? (
              <img
                src={`${config.imageUrl}/${focusProduct.image}`}
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <div className="bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                No Image
              </div>
            )
          ) : (
            <span className="text-primary font-semibold">
              Select a product for display
            </span>
          )}
        </div>
      </div>

      <AddProduct
        isOpen={addModal}
        onConfirm={() => {
          setAddModal(false);
          fetchProduct();
        }}
        onClose={() => {
          setAddModal(false);
        }}
        fetchCategory={fetchCategory}
        fetchProduct={fetchProduct}
        category={category}
      />
      <Category
        isOpen={catModal}
        onConfirm={() => {
          setCatModal(false);
        }}
        onClose={() => {
          setCatModal(false);
        }}
        fetchCategory={fetchCategory}
        category={category}
      />
      <EditProduct
        fetchProduct={fetchProduct}
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        onConfirm={() => {
          setEditModal(false);
          fetchProduct();
        }}
        editProd={selectedItem}
        category={category}
        id={selectedItem._id}
      />
    </Layout>
  );
};

export default Inventory;
