import { Navigate } from 'react-router-dom';
import api from '../utils/axios.js';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(true);
    
    const verifyToken = async() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsValid(false);
                return;
            }

            const res = await api.get('/api/auth/verify', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                setIsValid(true);
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            setIsValid(false);
            localStorage.removeItem('token'); // Clear invalid token
        }
    }

    useEffect(() => {
        verifyToken();
    }, []);

    if (!isValid) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;