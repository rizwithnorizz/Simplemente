import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/axios.js';

const PublicRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(false);
    
    const verifyToken = async () => {
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
    };

    useEffect(() => {
        verifyToken();
    }, []);

    if (isValid) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;