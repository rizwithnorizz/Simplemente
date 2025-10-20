import React, { useEffect, useState } from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { EyeClosed, EyeOff, LucideEye } from "lucide-react";

const Dashboard = () => {
  document.title = "Dashboard";
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hideBal, setHideBal] = useState(true);
  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/analytics");
      setAnalytics(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching analytics");
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </Layout>
    );
  }

  // Transform event sales data for the chart
  const eventSalesData = Object.entries(analytics?.eventSales || {}).map(
    ([name, value]) => ({
      name,
      revenue: value,
    })
  );

  return (
    <Layout>
      <div className="space-y-6 p-4">
        {/* Revenue Card */}
        <div className="flex flex-col bg-gradient-to-l from-primary to-accent rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Overall Revenue</h2>
          <div className="flex items-center gap-4 text-4xl font-bold">
            {hideBal ? (
              <span>
                {"₱" +
                  analytics?.overallRevenue.toLocaleString().replace(/./g, "*")}
              </span>
            ) : (
              <span>₱{analytics?.overallRevenue.toLocaleString()}</span>
            )}
            <button onClick={() => setHideBal(!hideBal)}>
              {hideBal ? (
                <EyeOff className="text-white" />
              ) : (
                <LucideEye className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Charts Row */}
        {/* ensure grid children can shrink without collapsing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          {/* Sales per Event */}
          <div className="bg-white rounded-xl p-6 shadow-md min-w-0">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">
              Sales per Event
            </h2>
            {eventSalesData.length !== 0 ? (
              <div className="h-80 min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={eventSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#e96d7b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div>
                <p className="text-gray-500">No sales data available.</p>
              </div>
            )}
          </div>

          {/* Stock Percentage */}
          <div className="bg-white rounded-xl p-6 shadow-md min-w-0">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">
              Stock Levels
            </h2>
            <div className="space-y-4 max-h-80  overflow-y-auto">
              {analytics.stockPercentages.length !== 0 ? (
                analytics.stockPercentages.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500">
                        {item.remaining} remaining
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-l from-primary to-accent rounded-xl h-2.5"
                        style={{ width: `${item.totalPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No stock data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Best Sellers */}
        {/* ensure the table card also won't collapse in narrow layouts */}
        <div className="bg-white rounded-xl p-6 shadow-md min-w-0">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">
            Best Selling Products
          </h2>
          <div className="overflow-y-auto">
            {analytics.bestSellers.length !== 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Sold
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics?.bestSellers.map((product) => (
                    <tr key={product.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 text-right">
                        ₱{product.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No best seller data available.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
