'use client';
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/firebase/config';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Flame,
  Car, 
  Search, 
  TrendingUp, 
  Bell, 
  Zap, 
  Target,
  BarChart3,
  MessageSquare,
  Shield,
  Smartphone,
  Clock
} from 'lucide-react'

export default function ModernLandingPage() {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(user !== null);
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333] flex flex-col items-center">
      <Navigation isAuthenticated={isAuthenticated ?? false} />
      {/* Main content wrapper */}
      <main className="flex-grow w-full">
        {/* Bento Box Layout */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hero Section */}
            <Card className="md:col-span-2 bg-[#FFE5E5] border-none">
              <CardContent className="flex flex-col items-center text-center space-y-8 p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Car className="h-12 w-12 text-[#FF6F61]" />
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    AutoHunter
                    <span className="text-[#FF6F61]"> Pro</span>
                  </h1>
                </div>
                <p className="max-w-[700px] text-lg text-[#333333]/80 sm:text-xl">
                  Your AI-powered vehicle sourcing assistant — helping you find, analyze, and secure the best deals faster than ever.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-[#FF6F61] font-medium mb-6">
                  <Search className="h-4 w-4" />
                  <span>Search Less.</span>
                  <TrendingUp className="h-4 w-4" />
                  <span>Close More.</span>
                  <Car className="h-4 w-4" />
                  <span>Source Smarter.</span>
                </div>
                {/* <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#FF6F61] text-white hover:bg-[#FFB3B0]">
                    Start Free Trial
                  </Button>
                  <Button variant="outline" className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FFE5E5]">
                    See How It Works
                  </Button>
                </div> */}
              </CardContent>
            </Card>

            {/* Newsletter Section */}
            {/* <Card className="bg-[#FFE5E5] border-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-[#333333]">Get Early Access</CardTitle>
                <CardDescription className="text-center text-[#333333]/80">
                  Be the first to know when AutoHunter Pro launches. Get exclusive early access and special pricing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-white border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                  />
                  <Button type="submit" className="bg-[#FF6F61] text-white hover:bg-[#FFB3B0]">
                    Join Waitlist
                  </Button>
                </form>
              </CardContent>
            </Card> */}

            {/* Features Section */}
            {[
              { Icon: Search, title: 'AI-Powered Search', description: 'Advanced algorithms find the best deals before anyone else sees them.' },
              { Icon: BarChart3, title: 'Smart Deal Scoring', description: 'AI analyzes market data to score each listing and identify hidden opportunities.' },
              { Icon: Bell, title: 'Real-Time Alerts', description: 'Get instant notifications when vehicles matching your criteria hit the market.' },
              { Icon: MessageSquare, title: 'Seller Communication', description: 'Built-in messaging tools to contact sellers and negotiate deals efficiently.' },
              { Icon: Shield, title: 'Risk Assessment', description: 'Automated flagging of potential issues like salvage titles or suspicious listings.' },
              { Icon: Clock, title: 'Market Timing', description: 'Know the best times to buy and sell based on market trends and seasonality.' },
            ].map((feature, index) => (
              <Card key={index} className="bg-[#FFE5E5] border-none hover:shadow-md transition-shadow">
                <CardHeader>
                  <feature.Icon className="h-10 w-10 text-[#FF6F61] mb-2" />
                  <CardTitle className="text-[#FF6F61]">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[#333333]">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}

            {/* CTA Section */}
            <Card className="md:col-span-3 bg-[#FFB3B0] border-none">
              <CardContent className="flex flex-col items-center text-center space-y-8 p-8">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#333333]">
                  Ready to Transform Your Vehicle Sourcing?
                </h2>
                <p className="max-w-[600px] text-lg text-[#333333]/80 sm:text-xl">
                  Join thousands of dealers and flippers who are already finding better deals with AutoHunter Pro.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#FF6F61] text-white hover:bg-[#FFB3B0]">Start Free Trial</Button>
                  <Button variant="outline" className="bg-white border-[#FF6F61] text-[#FF6F61] hover:bg-[#FFE5E5]">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
  )
}