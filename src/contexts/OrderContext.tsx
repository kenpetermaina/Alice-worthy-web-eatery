
import React, { createContext, useContext, useState } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  available: boolean;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  tableNumber: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed';
  total: number;
  timestamp: Date;
  customerName?: string;
  waiterId?: string;
}

interface OrderContextType {
  orders: Order[];
  menuItems: MenuItem[];
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      items: [
        {
          id: '1',
          name: 'Grilled Chicken Burger',
          price: 12.99,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
          description: 'Juicy grilled chicken with fresh lettuce and tomato',
          available: true,
          quantity: 2
        }
      ],
      tableNumber: 5,
      status: 'preparing',
      total: 25.98,
      timestamp: new Date(),
      customerName: 'John Doe'
    }
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Grilled Chicken Burger',
      price: 12.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      description: 'Juicy grilled chicken with fresh lettuce and tomato',
      available: true
    },
    {
      id: '2',
      name: 'Caesar Salad',
      price: 8.99,
      category: 'Appetizer',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
      description: 'Fresh romaine lettuce with caesar dressing and croutons',
      available: true
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      price: 6.99,
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
      description: 'Rich chocolate cake with chocolate frosting',
      available: true
    },
    {
      id: '4',
      name: 'Pasta Carbonara',
      price: 14.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300',
      description: 'Classic Italian pasta with bacon and cream sauce',
      available: true
    }
  ]);

  const addOrder = (orderData: Omit<Order, 'id' | 'timestamp'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      menuItems,
      addOrder,
      updateOrderStatus,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
