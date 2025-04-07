
import { Book } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-book-primary text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Book className="h-6 w-6 mr-2" />
            <span className="text-xl font-semibold">Literary Lens</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-book-accent transition-colors">
              Home
            </Link>
            <Link to="/browse" className="hover:text-book-accent transition-colors">
              Browse
            </Link>
            <Link to="/add-book" className="hover:text-book-accent transition-colors">
              Add Book
            </Link>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 text-center text-sm text-white/70">
          <p>© {new Date().getFullYear()} Literary Lens. All rights reserved.</p>
          <p className="mt-2">
            Literary Lens is a book recommendation service created to help readers discover their next favorite book.
          </p>
        </div>
      </div>
    </footer>
  );
}
