import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import { Menu, X } from 'lucide-react';

const MOBILE_BREAKPOINT = 1025;

const baseMenuItems = [
    { name: 'Dashboard', path: '/dashboard'},
    { name: 'Events', path: '/event'},
    { name: 'Inventory', path: '/inventory'},
    { name: 'Invoices', path: '/invoices'},
    { name: 'Logs', path: '/logs'}
];

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > MOBILE_BREAKPOINT);

    const eventPathMatch = location.pathname.match(/^\/event\/([^/]+)/);
    const currentEventID = eventPathMatch ? eventPathMatch[1] : null;
    
    
    // Dynamically construct menu items based on current route
    const menuItems = baseMenuItems.map(item => {
        if (item.name === 'Events' && currentEventID) {
            return {
                ...item,
                subItems: [
                    { name: 'Merch', path: `/event/${currentEventID}/merch` },
                    { name: 'Sale', path: `/event/${currentEventID}/sale` }
                ]
            };
        }
        return item;
    });

    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth > MOBILE_BREAKPOINT);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async() => {
        try {
            localStorage.removeItem('token');
            navigate('/');
            toast.success('Logged out successfully');
        } catch(error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <>
            <button 
                onClick={toggleSidebar}
                className={`fixed bottom-4 z-50 ${isSidebarOpen ? 'left-[17rem]' : 'left-4'} bg-white lg:hidden btn rounded-4xl btn-ghost transition-transform duration-300 ease-in-out`}
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className={`
                fixed top-0 left-0 z-40 w-64 h-full bg-white border-r border-gray-200 
                transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="justify-center text-3xl flex pb-5 text-pink-500 font-bold">
                        Simplemente
                    </div>
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <div key={item.name}>
                                <button
                                    onClick={() => {
                                        navigate(item.path);
                                        if (window.innerWidth < MOBILE_BREAKPOINT) {
                                            setSidebarOpen(false);
                                        }
                                    }}
                                    className={`w-full btn rounded-md justify-start text-xl
                                        ${location.pathname === item.path 
                                            ? 'btn-primary text-white' 
                                            : 'btn-ghost hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </button>
                                {item.subItems && (
                                    <div className="ml-4 mt-2 space-y-2">
                                        {item.subItems.map(subItem => (
                                            <button
                                                key={subItem.name}
                                                onClick={() => {
                                                    navigate(subItem.path);
                                                    if (window.innerWidth < MOBILE_BREAKPOINT) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                                className={`w-full btn btn-sm rounded-md justify-start text-md 
                                                    ${location.pathname === subItem.path 
                                                        ? ' btn-primary text-white'
                                                        : 'btn-ghost hover:text-white'
                                                    }`}
                                            >
                                                {subItem.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    <div className="mt-auto pt-4">
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="w-full btn btn-ghost rounded-md justify-start text-pink-500 text-xl hover:text-white"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <LogoutModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    handleLogout();
                    setIsModalOpen(false);
                }}
            />
        </>
    );
};

export default Sidebar;