"use client";
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Flame, Car, Search, TrendingUp } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function SignupPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Register the user in our database
      const response = await fetch('/api/auth/google-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register with Google');
      }

      const data = await response.json();
      console.log('Google user registered successfully:', data);

      router.push("/dashboard")
    } catch (error) {
      console.error('Error signing up with Google', error);
      alert(error instanceof Error ? error.message : 'An error occurred during Google registration');
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333] flex flex-col">
      <Navigation showBackButton={true} />
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-[#FFE5E5] border-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-[#FF6F61]" />
              <span className="text-2xl font-bold text-[#333333]">AutoHunter Pro</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Join AutoHunter Pro</CardTitle>
            <CardDescription className="text-center text-[#333333]/80">
              Start finding better deals with AI-powered vehicle sourcing and analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Signup Button */}
            <Button 
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2 py-6"
            >
              {isGoogleLoading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-lg font-medium">{isGoogleLoading ? 'Signing up...' : 'Continue with Google'}</span>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {/* Tagline */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-[#FF6F61] font-medium">
                <Search className="h-4 w-4" />
                <span>Search Less.</span>
                <TrendingUp className="h-4 w-4" />
                <span>Close More.</span>
                <Car className="h-4 w-4" />
                <span>Source Smarter.</span>
              </div>
              <p className="text-xs text-[#333333]/60">
                By creating an account, you agree to AutoHunter Pro's Terms of Service and Privacy Policy.
              </p>
            </div>
            
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FF6F61] hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
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