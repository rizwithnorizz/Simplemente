import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Merch = () => {
  const location = useLocation();
  const eventPathMatch = location.pathname.match(/^\/event\/([^/]+)/);
  const currentEventID = eventPathMatch ? eventPathMatch[1] : null;

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/merch/${currentEventID}`);
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
      <div className="btn btn-primary text-white min-w-min ml-4">
        Add Product to Showcase
      </div>
      <div className="h-screen rounded-lg p-4 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {products.map((item) => (
            <div key={item._id} className="bg-white rounded-xl p-4">
              <div className="flex justify-between">
                <div className="flex items-center justify-center flex-col">
                  <div className="h-32 w-32 lg:size-56 bg-gray-200 rounded-xl"></div>
                  <p className="text-pink-800 font-bold p-2">
                    {item.product.name}
                  </p>
                </div>
                <table className="w-full text-sm m-2">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Quantity:</td>
                      <td className="py-2 text-right font-medium">
                        {item.quantity}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Original:</td>
                      <td className="py-2 text-right font-medium">
                        ₱{item.product.orig_price}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Markup:</td>
                      <td className="py-2 text-right font-medium">
                        ₱{item.product.markup}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                <p className="border border-pink-500 rounded-xl p-2">
                  {item.product.category.name}
                </p>
                <div className="btn btn-primary text-white">Edit</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Merch;
