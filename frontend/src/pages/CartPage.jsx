import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, removeFromCart, fetchCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('card'); // card, upi, netbanking

    const handleCheckout = async () => {
        setIsProcessing(true);
        // Simulate bank processing
        setTimeout(async () => {
            try {
                await api.post('/orders');
                await fetchCart();
                setPaymentSuccess(true);
                setTimeout(() => {
                    setIsPaymentModalOpen(false);
                    navigate('/orders');
                }, 2000);
            } catch (err) {
                alert('Failed to place order.');
                setIsProcessing(false);
            }
        }, 3000);
    };

    const openPaymentModal = () => {
        setIsPaymentModalOpen(true);
        setPaymentSuccess(false);
        setIsProcessing(false);
    };

    if (!user) {
        return (
            <div className="w-full flex justify-center py-20 px-4">
                <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-orange-100 max-w-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">You need to log in to view your cart</h2>
                    <Link to="/login" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-semibold mt-4">Login Now</Link>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="w-full flex justify-center py-20 px-4">
                <div className="text-center max-w-lg">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                    <Link to="/" className="inline-block bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">Explore Restaurants</Link>
                </div>
            </div>
        );
    }

    const total = cart.items.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-200 pb-4">Checkout Cart</h1>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {cart.items.map((item) => (
                        <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
                            <img src={item.foodItem.imageUrl || 'https://via.placeholder.com/150'} alt={item.foodItem.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="text-lg font-bold text-gray-800">{item.foodItem.name}</h3>
                                <p className="text-rose-600 font-semibold mt-1">₹{item.foodItem.price.toFixed(2)} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-xl text-gray-900 w-20 text-right">₹{(item.foodItem.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-100 hover:bg-red-50 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="bg-gray-50 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
                    <div className="mb-4 sm:mb-0 text-center sm:text-left">
                        <span className="text-gray-500 font-medium block">Total Amount</span>
                        <span className="text-3xl font-black text-gray-900">₹{total.toFixed(2)}</span>
                    </div>
                    <button onClick={openPaymentModal} className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
                        Place Order 🚀
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300">
                        {paymentSuccess ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
                                <p className="text-gray-500">Your delicious food is being prepared.</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative">
                                    <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                    <h2 className="text-2xl font-bold mb-1">Make Payment</h2>
                                    <p className="text-indigo-100 opacity-80">Choose your preferred method</p>
                                    
                                    <div className="flex bg-white/10 p-1 rounded-2xl mt-6">
                                        <button 
                                            onClick={() => setActiveTab('card')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'card' ? 'bg-white text-indigo-700 shadow-sm' : 'text-white/80 hover:text-white'}`}
                                        >
                                            Card
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('upi')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'upi' ? 'bg-white text-indigo-700 shadow-sm' : 'text-white/80 hover:text-white'}`}
                                        >
                                            UPI
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('netbanking')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'netbanking' ? 'bg-white text-indigo-700 shadow-sm' : 'text-white/80 hover:text-white'}`}
                                        >
                                            Bank
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="mb-6">
                                        {activeTab === 'card' && (
                                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Card Number</label>
                                                    <input type="text" placeholder="XXXX XXXX XXXX 4455" className="w-full bg-transparent font-mono text-lg text-gray-800 outline-none" defaultValue="4242 4242 4242 4242" />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Expiry</label>
                                                        <input type="text" placeholder="MM/YY" className="w-full bg-transparent font-mono outline-none" defaultValue="12/28" />
                                                    </div>
                                                    <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">CVV</label>
                                                        <input type="password" placeholder="***" className="w-full bg-transparent font-mono outline-none" defaultValue="123" />
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Card Holder</label>
                                                    <input type="text" placeholder="Name on Card" className="w-full bg-transparent font-semibold outline-none" defaultValue={user.name} />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'upi' && (
                                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                                <div className="grid grid-cols-3 gap-4">
                                                    {['GPay', 'PhonePe', 'Paytm'].map(app => (
                                                        <button key={app} className="flex flex-col items-center p-3 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform"></div>
                                                            <span className="text-[11px] font-bold text-gray-600">{app}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="text-gray-400 text-sm">@</span>
                                                    </div>
                                                    <input type="text" placeholder="Enter UPI ID" className="w-full bg-gray-50 border border-gray-100 p-4 pl-10 rounded-2xl outline-none focus:border-indigo-300 transition-colors font-semibold" defaultValue={`${user.email.split('@')[0]}@okaxis`} />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'netbanking' && (
                                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bank => (
                                                        <button key={bank} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                                                            <div className="w-6 h-6 bg-gray-100 rounded-md"></div>
                                                            <span className="text-sm font-bold text-gray-700">{bank}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <select className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm font-semibold text-gray-600 appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:12px] bg-[right_1.5rem_center] bg-no-repeat">
                                                    <option>Other Banks</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mb-6 px-2">
                                        <span className="text-gray-400 text-sm font-medium">Total Payable</span>
                                        <span className="text-2xl font-black text-gray-900">₹{total.toFixed(2)}</span>
                                    </div>

                                    <button 
                                        onClick={handleCheckout}
                                        disabled={isProcessing}
                                        className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3
                                            ${isProcessing 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-200 hover:-translate-y-1'}`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay ₹${total.toFixed(2)}`
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Secure 256-bit SSL Encryption</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
