
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchBooks } from "@/services/bookService";
import { Book } from "@/types";
import { BookGrid } from "@/components/BookGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get search query from URL
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      const results = searchBooks(query);
      setBooks(results);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex">
          <Input
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border-book-accent/20"
          />
          <Button type="submit" className="ml-2 bg-book-primary hover:bg-book-secondary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-book-primary">
          {query ? `Search Results for "${query}"` : "Search Books"}
        </h1>
        {query && (
          <p className="text-muted-foreground mt-2">
            {books.length} {books.length === 1 ? "result" : "results"} found
          </p>
        )}
      </div>

      {query ? (
        <>
          {books.length > 0 ? (
            <BookGrid books={books} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">No books found for "{query}"</h2>
              <p className="text-muted-foreground mb-8">
                Try searching with different keywords or browse our collection.
              </p>
              <Link to="/browse">
                <Button className="bg-book-primary hover:bg-book-secondary">
                  Browse All Books
                </Button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Enter a search term</h2>
          <p className="text-muted-foreground">
            Search by book title, author name, or genre
          </p>
        </div>
      )}
    </div>
  );
}
