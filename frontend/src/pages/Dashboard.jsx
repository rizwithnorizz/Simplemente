import React from 'react'
import { useEffect } from 'react'
import axios from "axios";
import Layout from "../components/layout.jsx";
const Dashboard = () => {
  return (
    <Layout>
            <h1 className="font-bold text-pink-500 text-4xl mb-4">
                Dashboard
            </h1>
            <div className="flex md:flex-col-3 flex-col-2 gap-10 h-40">
                <div className="card w-full">
                    <div className='card-body bg-white rounded-2xl '>
                        <h1 className="font-semibold text-md">
                            Today's Sales
                        </h1>
                        <p className="text-4xl font-bold text-pink-500">
                            P1,250.00
                        </p>  
                    </div>
                </div>
                <div className="card w-full">
                    <div className='card-body bg-white rounded-2xl'>
                        <h1 className="font-semibold text-md">
                            Weekly Sales
                        </h1>
                        <p className="text-4xl font-bold text-pink-500">
                            P1,250.00
                        </p>  
                    </div>
                </div>
                <div className="card w-full">
                    <div className='card-body bg-white rounded-2xl'>
                       <h1 className="font-semibold text-md">
                            Monthly Sales
                        </h1>
                        <p className="text-4xl font-bold text-pink-500">
                            P1,250.00
                        </p>
                    </div>
                </div>
            </div>
    </Layout>
  )
}

export default Dashboard
