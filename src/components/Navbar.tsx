
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Book, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-book-light py-4 px-4 sm:px-6 border-b border-book-accent/20 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Book className="h-6 w-6 text-book-primary mr-2" />
            <Link to="/" className="text-xl font-semibold text-book-primary">
              Literary Lens
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-book-primary hover:text-book-secondary">
              Home
            </Link>
            <Link to="/browse" className="text-book-primary hover:text-book-secondary">
              Browse
            </Link>
            <Link to="/add-book" className="text-book-primary hover:text-book-secondary">
              Add Book
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-book-secondary" />
              <Input
                type="text"
                placeholder="Search books..."
                className="pl-8 w-64 border-book-accent/20 focus:border-book-accent focus:ring-1 focus:ring-book-accent bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2 bg-book-primary hover:bg-book-secondary">
              Search
            </Button>
          </form>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-book-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-book-primary hover:text-book-secondary py-2 px-4 rounded hover:bg-book-accent/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/browse" 
                className="text-book-primary hover:text-book-secondary py-2 px-4 rounded hover:bg-book-accent/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              <Link 
                to="/add-book" 
                className="text-book-primary hover:text-book-secondary py-2 px-4 rounded hover:bg-book-accent/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Book
              </Link>
              <form onSubmit={handleSearch} className="flex mt-2">
                <Input
                  type="text"
                  placeholder="Search books..."
                  className="w-full border-book-accent/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="ml-2 bg-book-primary hover:bg-book-secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
