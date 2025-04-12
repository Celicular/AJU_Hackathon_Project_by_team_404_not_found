'use client';

import { useState } from 'react';
import styles from './MenuItem.module.css';

export default function MenuItem({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(0);
  const { id, name, price, isAvailable, category } = item;

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => Math.max(0, prevQuantity - 1));
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart({
        id,
        name,
        price: Number(price),
        quantity,
        totalPrice: Number(price) * quantity
      });
      setQuantity(0);
    }
  };

  // Ensure price is a number for formatting
  const formattedPrice = Number(price).toFixed(2);

  return (
    <div className={`${styles.menuItem} ${!isAvailable ? styles.unavailable : ''}`}>
      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{name}</h3>
        {category && <span className={styles.itemCategory}>{category}</span>}
        <p className={styles.itemPrice}>₹{formattedPrice}</p>
        {!isAvailable && <span className={styles.unavailableLabel}>Out of Stock</span>}
      </div>
      
      <div className={styles.itemActions}>
        {isAvailable ? (
          <>
            <div className={styles.quantityControl}>
              <button 
                className={styles.quantityButton}
                onClick={handleDecrement}
                disabled={quantity === 0}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button 
                className={styles.quantityButton}
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button 
              className={styles.addButton}
              onClick={handleAddToCart}
              disabled={quantity === 0}
            >
              Add to Cart
            </button>
          </>
        ) : (
          <div className={styles.unavailableMessage}>
            Currently unavailable
          </div>
        )}
      </div>
    </div>
  );
}