
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Menu,
  Search,
  User,
  LogOut,
  Bookmark,
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
}

const Navbar = ({ isLoggedIn = false, userName = "" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/ec629fd5-ba51-4d2d-a871-4231af6e9393.png" 
              alt="iSchoolConnect" 
              className="h-8 md:h-10" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/scholarships" 
              className="text-foreground/80 hover:text-blue-500 transition-colors"
            >
              Scholarships
            </Link>
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-blue-500 transition-colors"
            >
              How It Works
            </Link>
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-blue-500 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-foreground/70 hover:text-blue-500"
                  asChild
                >
                  <Link to="/scholarships">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2 font-medium">{userName}</span>
                      <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/saved-scholarships" className="cursor-pointer flex items-center">
                        <Bookmark className="mr-2 h-4 w-4" />
                        <span>Saved Scholarships</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer flex items-center text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-foreground/70 hover:text-blue-500"
                  asChild
                >
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-blue-500 hover:bg-blue-600">
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/scholarships" 
                className="py-2 text-foreground/80 hover:text-blue-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Scholarships
              </Link>
              <Link 
                to="/" 
                className="py-2 text-foreground/80 hover:text-blue-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/" 
                className="py-2 text-foreground/80 hover:text-blue-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/profile" 
                    className="py-2 text-foreground/80 hover:text-blue-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/saved-scholarships" 
                    className="py-2 text-foreground/80 hover:text-blue-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Saved Scholarships
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="justify-start p-0 h-auto hover:bg-transparent text-red-500 hover:text-red-600"
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    asChild
                  >
                    <Link 
                      to="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    className="w-full justify-center bg-blue-500 hover:bg-blue-600"
                    asChild
                  >
                    <Link 
                      to="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
