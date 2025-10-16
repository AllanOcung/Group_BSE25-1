import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";
import LoginModal from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext"; // Add this import

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn, user, login, logout } = useAuth(); // Use auth context

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Team", href: "/team" },
    { name: "Blog", href: "/blog" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsLoginModalOpen(false);
    } catch (error) {
      // Handle login error (you can show a toast notification here)
      console.error("Login failed:", error);
      // You might want to show an error message to the user
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
            <span className="hidden font-bold sm:inline-block">
              Portfolio Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - UPDATED */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name}!
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Join Team
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation - UPDATED */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Welcome, {user?.name}!
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Join Team
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Add Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Header;