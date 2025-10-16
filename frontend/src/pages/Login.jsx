import React from 'react'
import { Heart } from "lucide-react";
import api from '../utils/axios.js';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async(e) => {
        e.preventDefault();
        try{ 
            const res = await api.post("/api/auth/login", {
                username: username,
                password: password
            });
            toast.success("Logged in successfully!");
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard'); // Redirect after login
        }catch(error){
            if (error.response) {
            switch (error.response.status) {
                case 500:
                    toast.error("Unable to connect to server");
                    break;
                case 401:
                    toast.error("Incorrect password");
                    break;
                case 404:
                    toast.error("User not found");
                    break;
                default:
                    toast.error("An error occurred");
                }
            }
        }
    }

    return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-200 rounded-full -ml-12 -mb-12 opacity-50"></div>
            
            <div className="relative z-10">
            <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-4 rounded-full">
                <Heart className="w-12 h-12 text-white fill-white" />
                </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center text-primary mb-2 ">Simplemente Porque</h1>
            <p className="text-center text-gray-500 mb-8">Inventory System</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                />
                </div>
                
                <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                />
                </div>
                
                <button
                type="submit"
                className="btn btn-primary text-white w-full"
                >
                Login
                </button>
            </form>
            </div>
        </div>
        </div>
    )
}

export default Login;
