import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
const Event = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const getAllEvent = async () => {
    const res = await api.get("/event");
    setEvents(res.data);
  };
  useEffect(() => {
    try {
      getAllEvent();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <h1 className="font-bold text-pink-500 text-4xl mb-4">Events</h1>
      <div className="btn btn-primary min-w-min text-white ml-4">Create new Event</div>
      <div className="flex flex-col-2 gap-5 p-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="h-[18rem] w-full bg-white rounded-xl p-4 hover:opacity-70 hover:shadow-lg hover:shadow-pink-300 group"
            onClick={() => navigate(`/event/${event._id}/merch`)}
          >
            <div className="flex justify-between md:gap-5">
              <h1 className="text-2xl font-semibold text-pink-500 ">
                {event.name}
              </h1>
              <div className="flex justify-between gap-2">
                <div className="border border-pink-500 rounded-2xl w-full h-[1rem] flex items-center text-center p-2">
                  {formatDate(event.start_date)}
                </div>
                <div className="border border-red-800 rounded-2xl w-full h-[1rem] flex items-center text-center p-2 text-red-800">
                  {formatDate(event.end_date)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Event;
