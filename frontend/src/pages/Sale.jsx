import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
const Sale = () => {
  document.title = "Sale";
  const { eventID } = useParams();
  const location = useLocation();
  const eventPathMatch = location.pathname.match(/^\/event\/([^/]+)/);
  const currentEventID = eventPathMatch ? eventPathMatch[1] : null;
  const [products, setProducts] = useState([]);

  const getAllMerch = async () => {
    try {
      const res = await api.get(`/api/merch/${currentEventID}`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const product = products.find((prod) => prod._id === item.product);
    if (!product || product.quantity <= 0) {
      toast.error("No more stock available!");
      return;
    }

    const updateProduct = products.map((prod) => {
      if (prod._id === item.product) {
        return { ...prod, quantity: prod.quantity - 1 };
      }
      return prod;
    });
    setProducts(updateProduct);

    const existingItem = cart.find(
      (cartItem) => cartItem.product._id === product.product._id
    );
    if (existingItem) {
      const updatedCart = cart.map((cartItem) => {
        if (cartItem.product._id === product.product._id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          name: item.name,
          product: product.product,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const changeCartQuantity = (itemId, newQuantity) => {
    const updatedCart = cart
      .map((cartItem) => {
        if (cartItem.product._id === itemId._id) {
          // If reducing to zero, return quantity to products
          if (cartItem.quantity === 1 && newQuantity === 0) {
            const newProd = products.map((prod) => {
              if (prod.product._id === itemId._id) {
                return { ...prod, quantity: prod.quantity + 1 };
              }
              return prod;
            });
            setProducts(newProd);
            return null; // Remove from cart
          }
          // If increasing, decrease product stock
          if (newQuantity > cartItem.quantity) {
            const product = products.find(
              (prod) => prod.product._id === itemId._id
            );
            if (!product || product.quantity <= 0) {
              toast.error("No more stock available!");
              return cartItem;
            }
            const newProd = products.map((prod) => {
              if (prod.product._id === itemId._id && prod.quantity > 0) {
                return { ...prod, quantity: prod.quantity - 1 };
              }
              return prod;
            });
            setProducts(newProd);
          }
          // If decreasing but not removing, increase product stock
          if (newQuantity < cartItem.quantity && newQuantity > 0) {
            const newProd = products.map((prod) => {
              if (prod.product._id === itemId._id) {
                return { ...prod, quantity: prod.quantity + 1 };
              }
              return prod;
            });
            setProducts(newProd);
          }
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      })
      .filter((cartItem) => cartItem && cartItem.quantity > 0);
    setCart(updatedCart);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    try {
      const orderItems = cart.map((item) => ({
        product: item.product,
        price: item.price,
        quantity: item.quantity,
      }));
      console.log(orderItems);
      await api.post(`/api/sale/${currentEventID}`, { products: orderItems });
      toast.success("Order placed successfully!");
      setCart([]);
      getAllMerch();
    } catch (error) {
      toast.error("Error placing order");
    }
  };

  const [currCat, setCurrCat] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/category");
      setCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllMerch();
    fetchCategory();
  }, []);

  const filterData = () => {
    const filter = products.filter((item) => {
      const matchesSearch = search === "" || item.product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = currCat === "" || item.product.category.name === currCat;
      return !!matchesSearch && !!matchesCategory;
    });
    setFiltered(filter);
  };

  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    filterData();
  }, [currCat, search, products]);

  const handleTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };
  return (
    <Layout>
      <h1 className="font-bold text-pink-500 text-4xl mb-4">Sale</h1>
      <div className="flex justify-between gap-4 overflow-y-auto h-screen">
        {/* Product section */}
        <div className="bg-white bg-opacity-50 w-full  rounded-xl">
          <div className="flex justify-between p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-accent border rounded-xl bg-transparent p-2 w-full mr-2"
            />
            <select
              className="border-accent border rounded-xl p-2 text-accent"
              defaultValue="Category"
              onChange={(e) => setCurrCat(e.target.value)}
            >
              <option>Category</option>
              {category.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5 p-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="w-full p-4 bg-white shadow-sm rounded-xl hover:shadow-lg cursor-pointer"
              >
                <div className="flex flex-col">
                  <div className="flex justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs w-fit p-1 rounded-xl border border-accent text-accent">
                        {item.product.category.name}
                      </span>
                      <span className="text-primary font-bold">
                        {item.product.name.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-accent font-bold text-4xl">
                      ₱{item.product.orig_price}
                    </span>
                  </div>
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
                          name: item.product.name,
                          product: item._id,
                          price: item.product.orig_price,
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
        <div className="bg-white bg-opacity-50 w-1/2 rounded-xl p-4 ">
          <h1 className="font-bold text-accent text-2xl mb-4">Cart</h1>
          <div className="overflow-y-auto h-[60vh] mb-4">
            {cart.length !== 0 ? (
              cart.map((item) => (
                <div
                  key={item.product}
                  className="flex flex-col bg-white shadow-md  hover:shadow-xl rounded-xl p-4 mb-2 w-full"
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs w-fit p-1 rounded-xl border border-accent text-accent">
                        {item.product.category.name}
                      </span>
                      <span className="text-primary font-bold">
                        {item.name.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-accent font-bold text-4xl">
                      {`₱` + item.price * item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        changeCartQuantity(item.product, item.quantity - 1);
                      }}
                      className="flex justify-center items-center btn btn-primary btn-sm text-white"
                    >
                      <Minus size={18} />
                    </button>
                    <div className="p-2 bg-accent bg-opacity-10 rounded-xl w-1/3 text-center">
                      <span className="text-accent font-bold text-md">
                        {item.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        changeCartQuantity(item.product, item.quantity + 1);
                      }}
                      className="flex justify-center items-center btn btn-primary btn-sm text-white"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-primary">Cart is empty</span>
            )}
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-4">
            <span className="text-accent font-bold text-xl">
              Total: ₱ {handleTotal()}
            </span>
            <button
              onClick={handlePlaceOrder}
              className="btn btn-primary text-white"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sale;
