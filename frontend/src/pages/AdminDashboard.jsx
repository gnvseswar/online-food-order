import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [newRest, setNewRest] = useState({ name: '', location: '', rating: 4.5, imageUrl: '' });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
        } else {
            api.get('/restaurants').then(res => setRestaurants(res.data));
            // Notice: To keep it simple, we focus on restaurants logic. The admin logic can be further expanded.
        }
    }, [user, navigate]);

    // Note: Creating restaurant requires backend endpoint. We will just simulate it as a placeholder.

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-rose-600 pb-2 inline-block">Admin Dashboard</h1>
            
            <div className="bg-white p-8 rounded-3xl shadow flex gap-6 items-center">
                <div className="text-5xl">🛠️</div>
                <div>
                   <h2 className="text-2xl font-bold">Welcome, Admin</h2>
                   <p className="text-gray-500">Manage your platform efficiently. Full admin features involve advanced forms.</p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Active Restaurants ({restaurants.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map(r => (
                        <div key={r.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                            <h4 className="font-bold">{r.name}</h4>
                            <p className="text-sm text-gray-500">{r.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
