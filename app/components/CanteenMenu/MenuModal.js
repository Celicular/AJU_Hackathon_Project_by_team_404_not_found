'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MenuItem from './MenuItem';
import Cart from './Cart';
import styles from './MenuModal.module.css';

export default function MenuModal({ isOpen, onClose }) {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [userEnrollment, setUserEnrollment] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Fetch menu items when the modal opens
  useEffect(() => {
    if (isOpen && mounted) {
      fetchMenuItems();
      
      // Get user enrollment from sessionStorage
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        if (userData.enrollment) {
          setUserEnrollment(userData.enrollment);
        }
      } catch (err) {
        console.error('Error fetching user data from session storage:', err);
      }
    }
  }, [isOpen, mounted]);
  
  // Extract categories from menu items
  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = [...new Set(menuItems.map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [menuItems]);
  
  const fetchMenuItems = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Fetching menu items...');
      const response = await fetch('/api/canteen-menu');
      const result = await response.json();
      
      if (result.success) {
        console.log('Menu items fetched successfully:', result.data.length);
        setMenuItems(result.data);
      } else {
        console.error('Failed to fetch menu items:', result.message);
        setError('Failed to fetch menu items');
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('An error occurred while fetching menu items');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToCart = (item) => {
    console.log('Adding item to cart:', item);
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity and total price
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { 
                ...cartItem, 
                quantity: cartItem.quantity + item.quantity,
                totalPrice: (cartItem.quantity + item.quantity) * Number(cartItem.price)
              }
            : cartItem
        );
      } else {
        // Add new item to cart with proper number conversion
        return [...prevItems, {
          ...item,
          price: Number(item.price),
          totalPrice: Number(item.totalPrice)
        }];
      }
    });
  };
  
  const handleRemoveFromCart = (itemId) => {
    console.log('Removing item from cart:', itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  const handleCheckout = async (items, paymentMethod) => {
    console.log('Processing checkout:', { items, paymentMethod });
    try {
      const requestData = {
        items,
        paymentMethod,
        enrollment: userEnrollment
      };
      
      console.log('Sending checkout request with data:', JSON.stringify(requestData));
      
      const response = await fetch('/api/canteen-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('Checkout response status:', response.status);
      const result = await response.json();
      console.log('Checkout response data:', result);
      
      if (result.success) {
        // Clear cart on successful checkout
        setCartItems([]);
      }
      
      return result;
    } catch (err) {
      console.error('Error during checkout:', err);
      return { success: false, message: 'Failed to process checkout: ' + err.message };
    }
  };
  
  const filteredMenuItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);
  
  // Don't render anything if modal is closed or not mounted yet
  if (!isOpen || !mounted) return null;
  
  const modalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.menuSection}>
          <div className={styles.menuHeader}>
            <h2 className={styles.menuTitle}>Canteen Menu</h2>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          
          {/* Category filter */}
          <div className={styles.categoryFilter}>
            <button 
              className={`${styles.categoryButton} ${activeCategory === 'all' ? styles.active : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map(category => (
              <button 
                key={category}
                className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading menu items...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={fetchMenuItems}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={styles.menuItems}>
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map(item => (
                  <MenuItem 
                    key={item.id} 
                    item={item} 
                    onAddToCart={handleAddToCart} 
                  />
                ))
              ) : (
                <p className={styles.emptyMessage}>No menu items available</p>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.cartSection}>
          <Cart 
            cartItems={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
  
  // Use createPortal to render the modal at the document body level
  return createPortal(modalContent, document.body);
} 