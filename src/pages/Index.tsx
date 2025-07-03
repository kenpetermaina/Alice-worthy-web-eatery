
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Settings, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const Index = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    orders: 0,
    customers: 0,
    revenue: 0
  });

  useEffect(() => {
    const targets = { orders: 1250, customers: 850, revenue: 45000 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    const intervals = Object.keys(targets).map(key => {
      const target = targets[key as keyof typeof targets];
      const increment = target / steps;
      let current = 0;
      let step = 0;

      return setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          current = target;
          clearInterval(intervals.find(i => i === interval));
        }
        setAnimatedNumbers(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepTime);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Order Management",
      description: "Track orders from placement to delivery with live updates and notifications.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Inventory Control",
      description: "Manage ingredients and stock levels with automated alerts and reporting.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Multi-user Access",
      description: "Role-based access for administrators, waiters, and kitchen staff.",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
              Smart Meals Hub
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Complete restaurant management solution that streamlines orders, manages inventory, 
              and enhances customer experience with cutting-edge technology.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
              <Link to="/customer-order">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 px-8 py-4 text-lg animate-pulse-glow">
                  Order Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-orange-200 hover:bg-orange-50">
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-in-right">
            <Card className="glass-effect hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  {animatedNumbers.orders.toLocaleString()}+
                </div>
                <div className="text-gray-600">Orders Processed</div>
              </CardContent>
            </Card>
            <Card className="glass-effect hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  {animatedNumbers.customers.toLocaleString()}+
                </div>
                <div className="text-gray-600">Happy Customers</div>
              </CardContent>
            </Card>
            <Card className="glass-effect hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  ${animatedNumbers.revenue.toLocaleString()}+
                </div>
                <div className="text-gray-600">Revenue Generated</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Smart Meals Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive solution addresses all your restaurant management needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-6 floating-animation`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants already using Smart Meals Hub to streamline their operations
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/customer-order">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Try Demo Order
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-orange-600">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">SM</span>
            </div>
            <span className="text-xl font-bold">Smart Meals Hub</span>
          </div>
          <p className="text-gray-400">
            © 2024 Smart Meals Hub. Transforming restaurant management, one order at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
