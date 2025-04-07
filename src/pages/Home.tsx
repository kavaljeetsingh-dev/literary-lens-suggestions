
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookGrid } from "@/components/BookGrid";
import { Button } from "@/components/ui/button";
import { getAllBooks, getAllGenres } from "@/services/bookService";
import { Book } from "@/types";
import { Search } from "lucide-react";

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [popularGenres, setPopularGenres] = useState<string[]>([]);
  
  useEffect(() => {
    // Get all books and sort them by rating for featured books
    const books = getAllBooks();
    const sortedByRating = [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setFeaturedBooks(sortedByRating.slice(0, 5));
    
    // Sort by publication year (descending) for recent books
    const sortedByYear = [...books].sort(
      (a, b) => (b.publicationYear || 0) - (a.publicationYear || 0)
    );
    setRecentBooks(sortedByYear.slice(0, 5));
    
    // Get a subset of genres for the popular genres section
    const allGenres = getAllGenres();
    setPopularGenres(allGenres.slice(0, 6));
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-book-primary">
          Discover Your Next <span className="text-book-secondary">Favorite Book</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-muted-foreground">
          Literary Lens helps you find books you'll love. Browse our collection, read reviews, 
          and get personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse">
            <Button size="lg" className="bg-book-primary hover:bg-book-secondary">
              Browse Books
            </Button>
          </Link>
          <Link to="/add-book">
            <Button size="lg" variant="outline" className="border-book-primary text-book-primary hover:bg-book-accent/10">
              Add a Book
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Books</h2>
          <Link to="/browse" className="text-book-secondary hover:text-book-primary">
            View All →
          </Link>
        </div>
        <BookGrid books={featuredBooks} />
      </section>

      {/* Popular Genres */}
      <section className="py-8 bg-book-light/50 rounded-lg p-6 my-8">
        <h2 className="text-2xl font-semibold mb-6">Popular Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popularGenres.map((genre) => (
            <Link
              key={genre}
              to={`/browse?genre=${encodeURIComponent(genre)}`}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-book-accent/10"
            >
              <div className="text-lg font-medium text-book-primary">{genre}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Additions */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Additions</h2>
          <Link to="/browse" className="text-book-secondary hover:text-book-primary">
            View All →
          </Link>
        </div>
        <BookGrid books={recentBooks} />
      </section>

      {/* Search Banner */}
      <section className="bg-book-secondary text-white rounded-lg p-8 my-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Looking for something specific?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Search our extensive library of books by title, author, or genre to find your next read.
        </p>
        <Link to="/search">
          <Button size="lg" className="bg-white text-book-secondary hover:bg-book-light">
            <Search className="mr-2 h-5 w-5" />
            Search Books
          </Button>
        </Link>
      </section>
    </div>
  );
}
