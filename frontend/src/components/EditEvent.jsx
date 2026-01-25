import React from "react";
import { X, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/axios.js";
import toast from "react-hot-toast";
const EditEvent = ({ isOpen, onClose, onConfirm, event }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split("T")[0];
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Invalid date:", error);
      return new Date().toISOString().split("T")[0];
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: event.name || "",
        start_date: formatDate(event.start_date),
        end_date: formatDate(event.end_date),
        showcase: event.showcase || [],
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateEvent = async () =>{ 
    try {
        await api.put(`/api/event/${event._id}`, {
            name: formData.name,
            start_date: new Date(formData.start_date),
            end_date: new Date(formData.end_date)
        })
        toast.success("Event updated!");
        onConfirm();
    } catch (error) {
        console.log(error);
        toast.error("Error updating event!");
    }
  }

  const deleteEvent = async () => {
      try {
        await api.delete(`/api/event/${event._id}`);
        toast.success("Event deleted!");
        onConfirm();
      } catch (error) {
        console.log(error);
        toast.error("Error deleting event!");
      }
  }

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-[998]" />
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 md:w-2/4 w-3/4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-500">
              Create a new Event
            </h2>
            <button onClick={onClose}>
              <X className=" text-red-500 text-xl  hover:text-red-200" />
            </button>
          </div>
          <div className="flex-col flex">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-pink-500"
            >
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-sm w-full bg-gray-100"
            />
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-pink-500"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="input input-sm w-full bg-gray-100"
            />
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-pink-500"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="input input-sm w-full bg-gray-100"
            />
            <button onClick={() => {updateEvent()}} className="btn btn-primary text-white mt-4">
              Save Changes
            </button>
            <button className="btn btn-secondary text-white mt-4" onClick={() => {deleteEvent()}}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEvent;
