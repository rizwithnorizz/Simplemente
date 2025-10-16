import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddMerch from "../components/AddMerch.jsx";
import EditMerch from "../components/EditMerch.jsx";

const Merch = () => {
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

  useEffect(() => {
    fetchProducts();
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

      <div className="grid grid-cols-4 items-center w-1/2  pt-4">
        <span className="font-medium text-center text-primary">Product</span>
        <span className="font-medium text-center ">Quantity</span>
        <span className="font-medium text-center text-accent w-2/3">Category</span>

      </div>
      <div className="h-screen rounded-lg p-4 overflow-y-auto flex justify-between gap-4">
        <div className=" w-full">
          {products.map((item, index) => (
            <div
              key={item._id}
              tabIndex={0}
              className="bg-white rounded-xl collapse collapse-sm mb-2"
              onFocus={() => setCurrentProduct(item)}
            >
              <div className="collapse-title">
                <div className="sm:grid sm:grid-cols-4 flex flex-col sm:gap-10 items-center">
                  <span className="font-medium text-center text-primary">
                    {item.product.name.toUpperCase()}
                  </span>
                  <span className="font-medium text-center ">
                    {item.quantity}
                  </span>

                  <span className="font-medium text-center text-accent">
                    {item.product.category?.name || "No category"}
                  </span>
                  <button 
                  onClick={(e) => {e.stopPropagation(); setEditModal(true)}}
                  className="btn btn-primary text-white w-20 ">
                    Edit
                  </button>
                </div>
              </div>
              <div className="collapse-content">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 flex flex-col items-center">
                   <span className="font-bold text-primary underline">₱{item.product.orig_price}</span>
                    Original Price
                  </span>
                  <span className="text-sm text-gray-600 flex flex-col items-center">
                   <span className="font-bold text-primary underline">₱{item.product.markup}</span>
                    Markup
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full ">
          <div className="bg-white h-80 rounded-xl p-2 flex flex-col justify-center items-center">
            {currentProduct ? (
              <>
                <div className="h-3/4 w-3/4 bg-gray-500 rounded-xl"/>

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
        onClose={() => {setEditModal(false); setCurrentProduct(null)}}
        onConfirm={() => {fetchProducts(); setEditModal(false); setCurrentProduct(null)}}
        showcase={currentProduct}
        event={currentEventID}
        />
    </Layout>
  );
};

export default Merch;
