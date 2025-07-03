
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useOrders, MenuItem, OrderItem } from '@/contexts/OrderContext';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check } from 'lucide-react';

const CustomerOrder = () => {
  const { menuItems, addOrder } = useOrders();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !tableNumber || cart.length === 0) {
      toast.error('Please fill in all details and add items to cart');
      return;
    }

    setIsOrdering(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    addOrder({
      items: cart,
      tableNumber: parseInt(tableNumber),
      status: 'pending',
      total: getTotalPrice(),
      customerName
    });

    setOrderPlaced(true);
    setIsOrdering(false);
    toast.success('Order placed successfully!');
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center animate-scale-in">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you, {customerName}! Your order for table {tableNumber} has been received 
              and is being prepared.
            </p>
            <div className="space-y-3">
              <Link to="/">
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Back to Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setOrderPlaced(false);
                  setCart([]);
                  setCustomerName('');
                  setTableNumber('');
                }}
              >
                Place Another Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            <span className="font-semibold">{cart.length} items</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              ${getTotalPrice().toFixed(2)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gradient mb-8">
              Order Your Meal
            </h1>

            {categories.map(category => (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems
                    .filter(item => item.category === category && item.available)
                    .map(item => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-orange-600">
                              ${item.price.toFixed(2)}
                            </span>
                            <Button
                              onClick={() => addToCart(item)}
                              size="sm"
                              className="bg-gradient-primary hover:opacity-90"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Your Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Your Name</Label>
                    <Input
                      id="customerName"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tableNumber">Table Number</Label>
                    <Input
                      id="tableNumber"
                      type="number"
                      placeholder="Enter table number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Items:</h3>
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No items in cart</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-orange-600 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                {cart.length > 0 && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-orange-600">${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isOrdering}
                      className="w-full bg-gradient-primary hover:opacity-90 py-3"
                    >
                      {isOrdering ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrder;
