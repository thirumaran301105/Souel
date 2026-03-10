import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { menuAPI } from '../services/api';
import MenuItem from '../components/MenuItem';
import '../styles/Menu.css';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const category = selectedCategory === 'all' ? null : selectedCategory;
      const response = await menuAPI.getAll(category);
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    alert(`${item.name} added to cart!`);
  };

  const categories = ['all', 'coffee', 'tea', 'pastry', 'snack'];

  return (
    <div className="menu-page">
      <div className="menu-container">
        <h1>Our Menu</h1>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading menu items...</div>
        ) : items.length === 0 ? (
          <div className="no-items">No items available in this category</div>
        ) : (
          <div className="menu-grid">
            {items.map(item => (
              <MenuItem
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
