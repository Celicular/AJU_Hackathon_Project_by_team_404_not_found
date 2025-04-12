'use client';

import { useState } from 'react';
import styles from './Cart.module.css';

export default function Cart({ cartItems, onRemoveItem, onCheckout, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Ensure all prices are properly formatted
  const safeCartItems = cartItems.map(item => ({
    ...item,
    price: Number(item.price),
    totalPrice: Number(item.totalPrice)
  }));

  const totalAmount = safeCartItems.reduce((total, item) => total + item.totalPrice, 0);

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCheckout = async () => {
    if (safeCartItems.length === 0) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await onCheckout(safeCartItems, paymentMethod);
      
      if (response.success) {
        setIsSuccess(true);
        // Reset cart after successful checkout is handled by parent component
      } else {
        setError(response.message || 'Failed to process order');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isSuccess) {
      setIsSuccess(false);
    }
    onClose();
  };

  const formatPrice = (price) => Number(price).toFixed(2);

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h2 className={styles.cartTitle}>Your Order</h2>
        <button 
          className={styles.closeButton} 
          onClick={handleClose}
          aria-label="Close cart"
        >
          ×
        </button>
      </div>

      {isSuccess ? (
        <div className={styles.successMessage}>
          <div className={styles.checkmarkCircle}>
            <div className={styles.checkmark}></div>
          </div>
          <h3>Order Placed Successfully!</h3>
          <p>Your order has been placed successfully.</p>
          {paymentMethod === 'cash' && (
            <p>Please pay at the counter when collecting your order.</p>
          )}
          {paymentMethod === 'online' && (
            <p>Your online payment has been processed successfully.</p>
          )}
          <button 
            className={styles.continueButton}
            onClick={handleClose}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {safeCartItems.length === 0 ? (
              <p className={styles.emptyCart}>Your cart is empty</p>
            ) : (
              safeCartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>
                      ₹{formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <p className={styles.itemTotal}>₹{formatPrice(item.totalPrice)}</p>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {safeCartItems.length > 0 && (
            <>
              <div className={styles.cartTotal}>
                <h3>Total</h3>
                <p className={styles.totalAmount}>₹{formatPrice(totalAmount)}</p>
              </div>

              <div className={styles.paymentOptions}>
                <h3 className={styles.paymentTitle}>Payment Method</h3>
                <div className={styles.paymentMethods}>
                  <button
                    className={`${styles.paymentMethod} ${paymentMethod === 'cash' ? styles.selected : ''}`}
                    onClick={() => handlePaymentMethodChange('cash')}
                  >
                    <span className={styles.methodIcon}>💵</span>
                    <span className={styles.methodName}>Cash at Counter</span>
                  </button>
                  <button
                    className={`${styles.paymentMethod} ${paymentMethod === 'online' ? styles.selected : ''}`}
                    onClick={() => handlePaymentMethodChange('online')}
                  >
                    <span className={styles.methodIcon}>💳</span>
                    <span className={styles.methodName}>Online Payment</span>
                  </button>
                </div>
              </div>

              {error && <p className={styles.errorMessage}>{error}</p>}

              <button 
                className={styles.checkoutButton}
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
} 