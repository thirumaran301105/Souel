import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import '../styles/Orders.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userId = user.id || user.uid;
      const response = await orderAPI.getUserOrders(userId);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancel(orderId);
        fetchOrders();
      } catch (error) {
        alert('Failed to cancel order');
      }
    }
  };

  if (!user) {
    return (
      <div className="orders-page">
        <div className="not-logged-in">
          <h2>Please log in to view your orders</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="orders-page loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start by browsing our menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Your Orders</h1>

        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.substring(0, 8)}</h3>
                <span className={`status ${order.status}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="order-details">
                <p><strong>Date:</strong> {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}</p>
                <p><strong>Type:</strong> {order.orderType}</p>
                <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                <p><strong>Estimated Time:</strong> {order.estimatedTime} minutes</p>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.menuItemName || item.menuItem?.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="cancel-btn"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
