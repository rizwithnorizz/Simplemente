import React from 'react'
import Layout from "../components/layout.jsx";
import api from "../utils/axios.js";
import { useParams } from 'react-router';

const Sale = () => {
    const { eventID } = useParams();
    const getAllMerch = async () => { 
        try{
            const res = await api.get(`/event/${eventID}`);
            console.log(res.data);
        }catch (error) {
            
        }
    }
    
  return (
    <Layout>
        <h1 className="font-bold text-pink-500 text-4xl mb-4">
            Sale
        </h1>
    </Layout>
  )
}

export default Sale
