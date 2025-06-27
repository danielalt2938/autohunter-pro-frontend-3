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
  X,
  Search,
  Plus,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

// Correct import based on official tutorial
import { liteClient } from 'algoliasearch/lite';

import {
  InstantSearch,
  Hits,
  Configure,
  Highlight,
  connectSearchBox
} from 'react-instantsearch-dom';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

// Initialize the search client with liteClient
const searchClient = liteClient('UAP9GN7E33', 'e53f5aae30b9abb134cc1fc817d8cd9a');

// Custom SearchBox with full styling control
const CustomSearchBox = connectSearchBox(({ currentRefinement, refine }) => (
  <input
    className="w-full pl-16 pr-6 py-6 text-xl border-3 border-[#FFB3B0] rounded-2xl bg-white/90 placeholder-[#333333]/50 focus:border-[#FF6F61] focus:ring-8 focus:ring-[#FF6F61]/20 focus:outline-none transition-all duration-300 shadow-lg font-medium"
    type="search"
    placeholder='Search by make, model, year, price, location... Try "Honda Accord 2018" or "BMW under $25000"'
    value={currentRefinement}
    onChange={e => refine(e.currentTarget.value)}
    autoFocus
  />
));

function VehicleHit({ hit }: any) {
  const info = hit.vehicle_info || {};
  const pub = hit.publication_info || {};
  const profile = hit.profile_info || {};
  return (
    <div className="bg-white rounded-2xl border border-[#FFB3B0] p-6 hover:shadow-xl hover:border-[#FF6F61] hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={pub.images?.[0] || '/placeholder.png'}
            alt={pub.product_title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {info.year && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6F61] to-[#FFB3B0] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {info.year}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <a href={pub.publication_link} target="_blank" rel="noopener noreferrer">
            <h3 className="font-bold text-xl text-[#FF6F61] mb-3 line-clamp-2 group-hover:text-[#333333] transition-colors">
              <Highlight attribute="product_title" hit={hit}  tagName="mark" />
            </h3>
          </a>
          
          {/* Vehicle Details */}
          <div className="space-y-3 mb-4">
            {(info.mileage || info.fuel_type || info.transmission) && (
              <div className="flex flex-wrap gap-2 text-xs">
                {info.mileage && (
                  <span className="bg-gradient-to-r from-[#FFE5E5] to-[#FFF0F0] text-[#333333] px-3 py-1.5 rounded-full font-medium">
                    📊 {info.mileage.toLocaleString()} mi
                  </span>
                )}
                {info.fuel_type && (
                  <span className="bg-gradient-to-r from-[#FFE5E5] to-[#FFF0F0] text-[#333333] px-3 py-1.5 rounded-full font-medium">
                    ⛽ {info.fuel_type}
                  </span>
                )}
                {info.transmission && (
                  <span className="bg-gradient-to-r from-[#FFE5E5] to-[#FFF0F0] text-[#333333] px-3 py-1.5 rounded-full font-medium">
                    ⚙️ {info.transmission}
                  </span>
                )}
              </div>
            )}
            
            {pub.publication_description && (
              <p className="text-sm text-[#333333]/70 line-clamp-2 leading-relaxed">
                {pub.publication_description}
              </p>
            )}
          </div>
          
          {/* Seller Info */}
          {(profile.profile_name || profile.is_dealership) && (
            <div className="text-xs text-[#333333]/50 mb-4 flex items-center">
              <span className="w-2 h-2 bg-[#FF6F61] rounded-full mr-2 animate-pulse"></span>
              <span className="font-medium">{profile.profile_name}</span>
              <span className="ml-1">{profile.is_dealership ? '(Dealer)' : '(Private)'}</span>
            </div>
          )}
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FFE5E5]">
          <span className="text-3xl font-bold text-[#333333] bg-gradient-to-r from-[#FF6F61] to-[#FFB3B0] bg-clip-text text-transparent">
            ${pub.product_price?.toLocaleString() || hit.product_price?.toLocaleString() || 'N/A'}
          </span>
          <a
            href={pub.publication_link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#FF6F61] to-[#FFB3B0] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Modal Backdrop Component
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, model: "Honda Accord", years: "2017-2020", price: "9000", distance: "50" },
    { id: 2, model: "Toyota Camry", years: "2018-2021", price: "12000", distance: "75" }
  ]);
  const [showViewAlertsModal, setShowViewAlertsModal] = useState(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
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
      setShowCreateAlertModal(false);
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#FFFFFF] to-[#FFE5E5]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#FF6F61] shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#FFF8F8] to-[#FFE5E5] text-[#333333] flex flex-col">
      <Navigation isAuthenticated={true} />
      
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-[#FF6F61] via-[#FFB3B0] to-[#FF6F61] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              Find Your Perfect Vehicle
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Search thousands of vehicles instantly with our advanced AI-powered search engine
            </p>
          </div>
          
          {/* Alert Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              onClick={() => setShowViewAlertsModal(true)}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
            >
              <Eye className="h-5 w-5 mr-2" />
              View Alerts ({alerts.length})
            </Button>
            <Button 
              onClick={() => setShowCreateAlertModal(true)}
              className="bg-white text-[#FF6F61] hover:bg-gray-50 hover:scale-105 transition-all duration-200 px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Alert
            </Button>
          </div>
        </div>
      </div>

      {/* Main Search Content */}
      <main className="flex-grow -mt-8 relative z-10">
        <div className="container mx-auto px-6">
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <InstantSearch searchClient={searchClient} indexName="vehicles">
                {/* Enhanced Search Input */}
                <div className="mb-12">
                  <div className="relative max-w-4xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Search className="h-8 w-8 text-[#FF6F61]" />
                    </div>
                    <CustomSearchBox />
                    {/* <div className="absolute inset-y-0 right-4 flex items-center">
                      <div className="bg-gradient-to-r from-[#FF6F61] to-[#FFB3B0] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md">
                        Press Enter
                      </div>
                    </div> */}
                  </div>
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-6 text-sm text-[#333333]/60">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-[#FF6F61] rounded-full mr-2"></span>
                        Popular: "Honda Accord 2018"
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-[#FFB3B0] rounded-full mr-2"></span>
                        Price: "BMW under $25000"
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-[#FF6F61] rounded-full mr-2"></span>
                        Features: "Toyota Camry manual"
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Search Configuration */}
                <Configure 
                  hitsPerPage={24}
                  attributesToHighlight={['product_title', 'vehicle_info.make', 'vehicle_info.model']}
                />
                
                {/* Search Results */}
                <div className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
                    <Hits hitComponent={VehicleHit} />
                  </div>
                </div>
              </InstantSearch>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* View Alerts Modal */}
      <Modal isOpen={showViewAlertsModal} onClose={() => setShowViewAlertsModal(false)}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#333333] flex items-center">
              <Bell className="h-6 w-6 text-[#FF6F61] mr-3" />
              Active Alerts ({alerts.length})
            </h2>
            <Button 
              onClick={() => setShowViewAlertsModal(false)}
              className="p-2 hover:bg-[#FFE5E5] rounded-full transition-colors"
              variant="ghost"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-gradient-to-r from-[#FFE5E5] to-[#FFF0F0] rounded-xl border border-[#FFB3B0] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF6F61] rounded-full flex items-center justify-center">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-[#333333]">{alert.model}</p>
                    <p className="text-sm text-[#333333]/70">Years: {alert.years}</p>
                    <p className="text-sm text-[#333333]/70">Max Price: ${alert.price} • Within {alert.distance} miles</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-[#FFB3B0] mx-auto mb-4" />
                <p className="text-[#333333]/60 text-lg">No active alerts yet</p>
                <Button 
                  onClick={() => {
                    setShowViewAlertsModal(false);
                    setShowCreateAlertModal(true);
                  }}
                  className="mt-4 bg-[#FF6F61] text-white hover:bg-[#FFB3B0]"
                >
                  Create Your First Alert
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Create Alert Modal */}
      <Modal isOpen={showCreateAlertModal} onClose={() => setShowCreateAlertModal(false)}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#333333] flex items-center">
              <Target className="h-6 w-6 text-[#FF6F61] mr-3" />
              Create New Alert
            </h2>
            <Button 
              onClick={() => setShowCreateAlertModal(false)}
              className="p-2 hover:bg-[#FFE5E5] rounded-full transition-colors"
              variant="ghost"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="model" className="text-sm font-semibold text-[#333333] mb-2 block">
                  Vehicle Model *
                </Label>
                <Input 
                  id="model"
                  value={newAlert.model}
                  onChange={(e) => setNewAlert({...newAlert, model: e.target.value})}
                  placeholder="e.g., Honda Accord, BMW 3 Series"
                  className="bg-white border-2 border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61] rounded-xl p-4 text-lg font-medium"
                />
              </div>
              <div>
                <Label htmlFor="years" className="text-sm font-semibold text-[#333333] mb-2 block">
                  Year Range *
                </Label>
                <Input 
                  id="years"
                  value={newAlert.years}
                  onChange={(e) => setNewAlert({...newAlert, years: e.target.value})}
                  placeholder="e.g., 2017-2020, 2019+"
                  className="bg-white border-2 border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61] rounded-xl p-4 text-lg font-medium"
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-sm font-semibold text-[#333333] mb-2 block">
                  Maximum Price *
                </Label>
                <Input 
                  id="price"
                  value={newAlert.price}
                  onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
                  placeholder="e.g., 25000"
                  className="bg-white border-2 border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61] rounded-xl p-4 text-lg font-medium"
                />
              </div>
              <div>
                <Label htmlFor="distance" className="text-sm font-semibold text-[#333333] mb-2 block">
                  Max Distance (miles) *
                </Label>
                <Input 
                  id="distance"
                  value={newAlert.distance}
                  onChange={(e) => setNewAlert({...newAlert, distance: e.target.value})}
                  placeholder="e.g., 50, 100"
                  className="bg-white border-2 border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61] rounded-xl p-4 text-lg font-medium"
                />
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button 
                onClick={handleCreateAlert}
                className="flex-1 bg-gradient-to-r from-[#FF6F61] to-[#FFB3B0] text-white hover:shadow-lg hover:scale-105 transition-all duration-200 py-4 text-lg font-semibold rounded-xl"
              >
                <Target className="h-5 w-5 mr-2" />
                Create Alert
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateAlertModal(false)}
                className="flex-1 border-2 border-[#FF6F61] text-[#FF6F61] hover:bg-[#FFE5E5] py-4 text-lg font-semibold rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="border-t border-[#FFE5E5] bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between py-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Flame className="h-6 w-6 text-[#FF6F61]" />
            <span className="text-sm font-medium">© 2024 AutoHunter Pro. All rights reserved.</span>
          </div>
          <nav className="flex items-center space-x-6">
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