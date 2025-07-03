
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Plus, AlertTriangle, Package, TrendingUp } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  category: string;
  lastUpdated: Date;
}

const Inventory = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Chicken Breast',
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      unit: 'kg',
      category: 'Meat',
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Tomatoes',
      currentStock: 8,
      minStock: 15,
      maxStock: 40,
      unit: 'kg',
      category: 'Vegetables',
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'Pasta',
      currentStock: 25,
      minStock: 20,
      maxStock: 60,
      unit: 'kg',
      category: 'Pantry',
      lastUpdated: new Date()
    },
    {
      id: '4',
      name: 'Olive Oil',
      currentStock: 5,
      minStock: 8,
      maxStock: 20,
      unit: 'L',
      category: 'Pantry',
      lastUpdated: new Date()
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    category: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
  const totalItems = inventoryItems.length;
  const categoryCounts = inventoryItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock * 0.8) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.currentStock || !newItem.minStock || !newItem.maxStock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name,
      currentStock: parseInt(newItem.currentStock),
      minStock: parseInt(newItem.minStock),
      maxStock: parseInt(newItem.maxStock),
      unit: newItem.unit,
      category: newItem.category,
      lastUpdated: new Date()
    };

    setInventoryItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unit: '',
      category: ''
    });
    setIsAddDialogOpen(false);
    toast.success('Inventory item added successfully!');
  };

  const updateStock = (id: string, newStock: number) => {
    setInventoryItems(prev => prev.map(item =>
      item.id === id 
        ? { ...item, currentStock: newStock, lastUpdated: new Date() }
        : item
    ));
    toast.success('Stock updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      
      <div className="container mx-auto p-4 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Inventory Management</h1>
            <p className="text-gray-600 text-lg">Monitor and manage ingredient stock levels</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-orange-200">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currentStock">Current Stock *</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      placeholder="0"
                      value={newItem.currentStock}
                      onChange={(e) => setNewItem({...newItem, currentStock: e.target.value})}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Min Stock *</Label>
                    <Input
                      id="minStock"
                      type="number"
                      placeholder="0"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({...newItem, minStock: e.target.value})}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxStock">Max Stock *</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      placeholder="0"
                      value={newItem.maxStock}
                      onChange={(e) => setNewItem({...newItem, maxStock: e.target.value})}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="kg, L, pcs"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="Meat, Vegetables, etc."
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem} className="w-full bg-gradient-primary hover:opacity-90">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Categories</p>
                  <p className="text-2xl font-bold">{Object.keys(categoryCounts).length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Stock Value</p>
                  <p className="text-2xl font-bold text-green-600">$2,450</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50 animate-pulse-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span>Low Stock Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                The following items need restocking:
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map(item => (
                  <Badge key={item.id} variant="destructive">
                    {item.name} ({item.currentStock} {item.unit})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryItems.map((item, index) => {
            const percentage = (item.currentStock / item.maxStock) * 100;
            const status = getStockStatus(item);
            
            return (
              <Card 
                key={item.id} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Current Stock</span>
                        <span className="font-semibold">
                          {item.currentStock} / {item.maxStock} {item.unit}
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Min: {item.minStock} {item.unit}</span>
                      <span>Updated: {item.lastUpdated.toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, Math.max(0, item.currentStock - 1))}
                        className="flex-1"
                      >
                        -1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, item.currentStock + 1)}
                        className="flex-1"
                      >
                        +1
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStock(item.id, item.maxStock)}
                        className="flex-1 bg-gradient-primary hover:opacity-90"
                      >
                        Restock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
