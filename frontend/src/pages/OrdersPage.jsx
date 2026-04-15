import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center w-full h-screen text-blue-500"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-current"></div></div>;

    if (!user) {
        return <div className="w-full text-center mt-20 text-xl font-bold text-gray-700">Please login to view your orders.</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-emerald-500 pb-2 inline-block">Order History</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-6">You haven't placed any orders. Start exploring!</p>
                    <Link to="/" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full font-bold shadow hover:shadow-lg transition-transform hover:-translate-y-0.5">Explore Food</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.slice().reverse().map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 gap-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order #{order.id}</span>
                                    <div className="text-sm text-gray-600 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <span className="text-lg font-black text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PLACED' ? 'bg-blue-100 text-blue-700' : order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
