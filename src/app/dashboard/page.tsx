'use client';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Flame, 
  Bell, 
  Target,
  Car,
  MapPin,
  DollarSign,
  Calendar,
  X
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, model: "Honda Accord", years: "2017-2020", price: "9000", distance: "50" },
    { id: 2, model: "Toyota Camry", years: "2018-2021", price: "12000", distance: "75" }
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    model: "",
    years: "",
    price: "",
    distance: ""
  });
  const router = useRouter();

  const getFirebaseToken = async () => {
    try {
      if (user) {
        const token = await auth.currentUser?.getIdToken();
        return token;
      }
    } catch (error) {
      console.error("Error getting Firebase token:", error);
      return null;
    }
  };

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ 
        priceId: priceId,
        metadata: {
          userId: user?.uid,
          role: 'Pro User',
        },
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    setIsLoading(false);
  };

  const handleCreateAlert = () => {
    if (newAlert.model && newAlert.years && newAlert.price && newAlert.distance) {
      const alert = {
        id: Date.now(),
        ...newAlert
      };
      setAlerts([...alerts, alert]);
      setNewAlert({ model: "", years: "", price: "", distance: "" });
      setShowCreateForm(false);
    }
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && !user) {
        router.push('/login');
      }

      const fetchRole = async () => {
        try {
          const token = await getFirebaseToken();
          if (token) {
            const res = await fetch('/api/user/role', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });

            const data = await res.json();
            setRole(data.role);
          }
        } catch (error) {
          console.error('Error fetching role:', error);
        }
      };

      if (user) {
        fetchRole();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  if (loading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FFFFFF]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF6F61]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333] flex flex-col">
      <Navigation isAuthenticated={true} />
      
      {/* Main content */}
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">
                Alerts & Filters
              </h1>
              <p className="text-[#333333]/60 mt-1">
                Manage your vehicle alerts and get notified when matching deals appear.
              </p>
            </div>
          </div>

          {/* Alerts Section */}
          <Card className="bg-[#FFE5E5] border-none">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-[#FF6F61]" />
                <span>🔔 Active Alerts</span>
              </CardTitle>
              <p className="text-sm text-[#333333]/60">
                Get notified when specific vehicles, price ranges, or keywords appear.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-white rounded-lg border border-[#FFB3B0] flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Car className="h-5 w-5 text-[#FF6F61]" />
                    <div>
                      <p className="font-medium text-sm">{alert.model} {alert.years}</p>
                      <p className="text-xs text-[#333333]/60">Under ${alert.price} within {alert.distance} miles</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {showCreateForm ? (
                <div className="p-4 bg-white rounded-lg border border-[#FFB3B0] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="model">Vehicle Model</Label>
                      <Input 
                        id="model"
                        value={newAlert.model}
                        onChange={(e) => setNewAlert({...newAlert, model: e.target.value})}
                        placeholder="e.g., Honda Accord"
                        className="bg-white border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="years">Year Range</Label>
                      <Input 
                        id="years"
                        value={newAlert.years}
                        onChange={(e) => setNewAlert({...newAlert, years: e.target.value})}
                        placeholder="e.g., 2017-2020"
                        className="bg-white border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Max Price</Label>
                      <Input 
                        id="price"
                        value={newAlert.price}
                        onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
                        placeholder="e.g., 9000"
                        className="bg-white border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="distance">Max Distance (miles)</Label>
                      <Input 
                        id="distance"
                        value={newAlert.distance}
                        onChange={(e) => setNewAlert({...newAlert, distance: e.target.value})}
                        placeholder="e.g., 50"
                        className="bg-white border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleCreateAlert}
                      className="bg-[#FF6F61] text-white hover:bg-[#FFB3B0]"
                    >
                      Create Alert
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FFE5E5]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="w-full bg-[#FF6F61] text-white hover:bg-[#FFB3B0]"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Create New Alert
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FFE5E5] w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Flame className="h-6 w-6 text-[#FF6F61]" />
            <span className="text-sm font-medium">© 2024 AutoHunter Pro. All rights reserved.</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="#" className="text-sm font-medium hover:text-[#FF6F61] transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#FF6F61] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#FF6F61] transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}