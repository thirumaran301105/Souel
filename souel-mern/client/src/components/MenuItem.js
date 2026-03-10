import React from 'react';
import '../styles/MenuItem.css';

const MenuItem = ({ item, onAddToCart }) => {
  // Handle missing or invalid item data
  if (!item || !item.price) {
    return null;
  }

  return (
    <div className="menu-item">
      <div className="item-image">{item.image}</div>
      <h3 className="item-name">{item.name}</h3>
      <p className="item-description">{item.description}</p>
      <div className="item-footer">
        <span className="item-price">₹{parseFloat(item.price).toFixed(2)}</span>
        {item.available ? (
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </button>
        ) : (
          <button className="add-to-cart-btn disabled">Out of Stock</button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
