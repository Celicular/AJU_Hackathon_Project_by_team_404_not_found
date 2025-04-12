import { NextResponse } from 'next/server';
import { query } from '../../../app/lib/mysql';

// GET handler to fetch all menu items
export async function GET() {
  try {
    const menuItems = await query('SELECT * FROM Menu ORDER BY category, name');
    
    // Ensure price values are properly formatted as numbers
    const formattedItems = menuItems.map(item => ({
      ...item,
      price: Number(item.price),
      isAvailable: Boolean(item.isAvailable)
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: formattedItems 
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch menu items', error: error.message },
      { status: 500 }
    );
  }
}

// POST handler to record a sale
export async function POST(request) {
  try {
    const { items, paymentMethod } = await request.json();
    
    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items provided' },
        { status: 400 }
      );
    }
    
    // Check if all required fields are present
    for (const item of items) {
      if (!item.id || !item.name || item.quantity === undefined || item.totalPrice === undefined) {
        return NextResponse.json(
          { success: false, message: 'Invalid item data provided' },
          { status: 400 }
        );
      }
    }

    // Process each item in the order without using transactions
    // (we'll use individual queries since transactions are causing issues)
    for (const item of items) {
      // Ensure values are properly formatted
      const itemId = Number(item.id);
      const quantity = Number(item.quantity);
      const totalPrice = Number(item.totalPrice);
      
      // Validate the item exists in Menu table
      const menuItem = await query('SELECT * FROM Menu WHERE id = ?', [itemId]);
      if (!menuItem || menuItem.length === 0) {
        return NextResponse.json(
          { success: false, message: `Item with ID ${itemId} not found in menu` },
          { status: 404 }
        );
      }
      
      // Insert sales record
      await query(
        'INSERT INTO SalesReport (itemId, itemName, quantity, totalPrice) VALUES (?, ?, ?, ?)',
        [itemId, item.name, quantity, totalPrice]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order processed successfully',
      paymentMethod
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process order',
        error: error.message 
      },
      { status: 500 }
    );
  }
}