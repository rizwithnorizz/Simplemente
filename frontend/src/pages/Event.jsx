import React from "react";
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import AddEvent from "../components/AddEvent.jsx";
import EditEvent from "../components/EditEvent.jsx";
const Event = () => {
  const [events, setEvents] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);
  const navigate = useNavigate();
  const getAllEvent = async () => {
    try {
      const res = await api.get("/api/event");
      setEvents(res.data);
    } catch (error) {
      console.log("Error encountered: ", error);
    }
  };
  useEffect(() => {
    getAllEvent();
  }, []);

  const [selectedEvent, setSelectedEvent] = useState({
    name: "",
    start_date: "",
    end_date: "",
    showcase: []
  });


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
      <div
        onClick={() => {
          setEventModal(true);
        }}
        className="btn btn-primary min-w-min text-white ml-4"
      >
        Create new Event
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 p-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="w-full bg-white rounded-xl p-4 hover:opacity-70 hover:shadow-lg hover:shadow-pink-300 group"
            onClick={() => navigate(`/event/${event._id}/merch`)}
          >
            <div className="flex justify-between md:gap-5">
              <h1 className="text-2xl font-semibold text-pink-500 ">
                {event.name}
              </h1>
            </div>
            <div className="h-[12rem] "/>
            <div className="flex justify-between">
              <div className="flex justify-between gap-2 items-baseline ">
                <div className="border border-pink-500 rounded-2xl w-full h-[1rem] flex items-center text-center p-2 mt-6">
                  {formatDate(event.start_date)}
                </div>
                <div className="border border-red-800 rounded-2xl w-full h-[1rem] flex items-center text-center p-2 text-red-800">
                  {formatDate(event.end_date)}
                </div>
              </div>
              <button onClick={(e) => {
                e.stopPropagation();
                setEditModal(true)
                setSelectedEvent(event);
              }} className="btn btn-primary text-white">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddEvent isOpen={eventModal} onClose={() => setEventModal(false)} onConfirm={() => {setEventModal(false); getAllEvent()}} />
      <EditEvent isOpen={editModal} onClose={() => setEditModal(false)} event={selectedEvent} onConfirm={() => {setEditModal(false); getAllEvent()}}/>
    </Layout>
  );
};

export default Event;
