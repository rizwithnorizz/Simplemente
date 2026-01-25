import React, { useEffect, useState } from 'react';
import Layout from '../components/layout.jsx';
import api from '../utils/axios.js';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Invoice = () => {
  document.title = "Invoice";
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/api/invoice');
      setInvoices(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching invoices');
      console.error(error);
      setLoading(false);
    }
  };
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const filterInvoices = () => {
    const filteredData = invoices.filter((invoice) => {
        if (search === "") return true;
        return (invoice.event && invoice.event._id === search);
    });
    setFiltered(filteredData);
  }

  useEffect(() => {
    filterInvoices();
  }, [search, invoices]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const calculateTotal = (cart) => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="font-bold text-pink-500 text-4xl mb-6">Transaction History</h1>
      <select className="select select-bordered w-full max-w-xs mb-6" value={search} onChange={(e) => setSearch(e.target.value)}>
        <option value="">All Events</option>
        {[...new Map(invoices.map((invoice) => [invoice.event?._id, invoice.event])).values()].map((event) => (
          <option key={event?._id} value={event?._id || ''}>
            {event?.name || 'N/A'}
          </option>
        ))}
      </select>
      <div className="space-y-6">
        {filtered.map((invoice) => (
          <div key={invoice._id} className="bg-white rounded-xl p-6 shadow-md">
            <div className="border-b pb-4 mb-4">
              <h2 className="font-semibold text-xl text-pink-600">
                Event: {invoice.event?.name || 'N/A'}
              </h2>
              <p className="text-gray-500">
                Transaction Date: {format(new Date(invoice.createdAt), 'PPpp')}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-center">Quantity</th>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-center">Category</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.cart.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2">{item.product.name}</td>
                      <td className="px-4 py-2 text-center">{item.product.category.name}</td>
                      <td className="px-4 py-2 text-right">₱{item.price}</td>
                      <td className="px-4 py-2 text-right">₱{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <span className="font-bold">Total: ₱{calculateTotal(invoice.cart)} </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Invoice;