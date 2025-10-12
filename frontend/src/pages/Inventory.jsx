import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddProduct from "../components/AddProduct.jsx";
import Category from "../components/Category.jsx";
const Inventory = () => {
  const [currCat, setCurrCat] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProd, setFilter] = useState([]);
  const [category, setCategory] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const fetchProduct = async () => {
    try {
      const res = await api.get("/product");
      setProducts(res.data);
    } catch (error) {
      toast.error(error);
    }
  };
  const fetchCategory = async () => {
    try {
      const res = await api.get("/category");
      setCategory(res.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const filterData = () => {
    const filtered = products.filter((item) => {
      return item.category.name === currCat || currCat === ""; // Show all if no category is selected
    });
    setFilter(filtered);
  };
  useEffect(() => {
    fetchProduct();
    fetchCategory();
  }, []);
  return (
    <Layout>
      <h1 className="font-bold text-pink-500 text-4xl mb-4">Inventory</h1>
      <div
        className="btn btn-primary text-white ml-4"
        onClick={() => setAddModal(true)}
      >
        Add new Product
      </div>
      <select
        className="select select-md select-accent ml-2"
        defaultValue="Category"
        onChange={(e) => {
          setCurrCat(e.target.value);
          filterData();
        }}
      >
        <option disabled={true}>Category</option>
        {category.map((cat) => (
          <option key={cat._id}>{cat.name}</option>
        ))}
      </select>
      <div 
      onClick={() => {setCatModal(true)}}
      className="btn bg-transparent hover:bg-transparent btn-sm ml-2">+</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-4">
        {products.map((item) => (
          <div key={item._id} className="bg-white rounded-xl p-4">
            <div className="flex justify-between">
              <div className="flex items-center justify-center flex-col">
                <div className="h-32 w-32 bg-gray-200 rounded-xl"></div>
                <p className="text-pink-800 font-bold p-2">{item.name}</p>
              </div>
              <table className="w-full text-sm m-2 ">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Category:</td>
                    <td className="py-2 text-right font-medium">
                      {item.category.name}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Original:</td>
                    <td className="py-2 text-right font-medium">
                      ₱{item.orig_price}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Markup:</td>
                    <td className="py-2 text-right font-medium">
                      ₱{item.markup}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <div className="btn btn-primary text-white">Edit</div>
            </div>
          </div>
        ))}
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
      />
      <Category
        isOpen={catModal}
        onConfirm={() => {

        }}
        onClose={() => {
          setCatModal(false);
        }}
      />
    </Layout>
  );
};

export default Inventory;
