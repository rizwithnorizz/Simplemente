import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Sale = () => {
  const { eventID } = useParams();
  const location = useLocation();
  const eventPathMatch = location.pathname.match(/^\/event\/([^/]+)/);
  const currentEventID = eventPathMatch ? eventPathMatch[1] : null;
  const [products, setProducts] = useState([]);
  const getAllMerch = async () => {
    try {
      const res = await api.get(`/api/merch/${currentEventID}`);
      setProducts(res.data);
      console.log(res.data);
    } catch (error) {}
  };

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      const updatedCart = cart.map((cartItem) => {
        if (cartItem._id === item._id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    const updateProduct = products.map((prod) => {
      if (prod._id === item._id) {
        return { ...prod, quantity: prod.quantity - 1 };
      }
      return prod;
    });
    setProducts(updateProduct);
  };
  useEffect(() => {
    getAllMerch();
  }, []);

  return (
    <Layout>
      <h1 className="font-bold text-pink-500 text-4xl mb-4">Sale</h1>
      <div className="flex justify-between gap-4 overflow-y-auto h-screen">
        {/* Product section */}
        <div className="bg-white bg-opacity-50 w-full  rounded-xl">
          {/* Search */}

          {/* Category Sort */}

          {/* Product Grid */}

          <div className="grid md:grid-cols-3 grid-cols-1 gap-5 p-4">
            {products.map((item) => (
              <div
                key={item._id}
                className="w-full p-4 bg-white shadow-sm rounded-xl hover:shadow-lg cursor-pointer"
              >
                <div className="flex flex-col ">
                  <span className="text-xs w-fit p-1 rounded-xl border border-accent text-accent">
                    {item.product.category.name}
                  </span>
                  <span className="text-primary font-bold">
                    {item.product.name.toUpperCase()}
                  </span>
                  <span className="text-accent font-bold text-4xl">
                    {`₱` + (item.product.orig_price + item.product.markup)}
                  </span>
                  <div className="p-2 mb-2 bg-accent bg-opacity-10 rounded-xl">
                    <span className="text-primary font-medium text-sm">
                      Stock:{" "}
                    </span>
                    <span className="text-accent font-bold text-md">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      className="btn btn-primary btn-sm text-white"
                      onClick={() =>
                        addToCart({
                          _id: item._id,
                          name: item.product.name,
                          price: item.product.orig_price + item.product.markup,
                          quantity: 1,
                        })
                      }
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Basket section */}
        <div className="bg-white bg-opacity- w-1/2 rounded-xl p-4 ">
          <h1 className="font-bold text-accent text-2xl mb-4">Cart</h1>
          <div className="overflow-y-auto max-h-screen h-[80vh] mb-4">
            {cart !== null ? (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col bg-white shadow-md  hover:shadow-xl rounded-xl p-4 mb-2 w-full"
                >
                  <span className="text-primary font-bold">
                    {item.name.toUpperCase()}
                  </span>
                  <span className="text-accent font-bold text-4xl">
                    {`₱` + item.price * item.quantity}
                  </span>
                  <div className="p-2 mb-2 bg-accent bg-opacity-10 rounded-xl">
                    <span className="text-accent font-bold text-md">
                      {item.quantity}
                    </span>
                  </div>
                </div>
              ))
              
            ) : (
              <span className="text-primary">Cart is empty</span>
            )}
            
            <div className="fixed bottom-10 lg:w-[27svw] w-[30svw] bg-white p-4 rounded-xl shadow-md flex flex-col gap-4">
              <span className="text-accent font-bold text-xl">Total: ₱</span>
              <button className="btn btn-primary text-white">Place Order</button>
            </div>
          </div>

          {/* Product lineup */}

          {/* Place Order*/}

          {/* Cancel Order */}
        </div>
      </div>
    </Layout>
  );
};

export default Sale;
