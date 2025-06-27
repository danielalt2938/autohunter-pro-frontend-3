import Link from 'next/link'
import { Flame, ArrowLeft, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { auth } from '@/firebase/config'

interface NavigationProps {
  showBackButton?: boolean;
  isAuthenticated?: boolean; // Add this line
}

export default function Navigation({ showBackButton = false, isAuthenticated = false }: NavigationProps) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FFE5E5] bg-[#FFFFFF]/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Flame className="h-6 w-6 text-[#FF6F61]" />
          <span className="text-xl font-bold text-[#FF6F61]">AutoHunterPro</span>
        </Link>
        {showBackButton ? (
          <Link href="/" className="flex items-center text-sm font-medium hover:text-[#FF6F61] transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        ) : (
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FFE5E5] hover:text-[#FF6F61]">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/signup">
                <Button variant="outline" className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FFE5E5] hover:text-[#FF6F61]">
                  Sign Up
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}