
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllBooks, getAllGenres, getAllAuthors, getBooksByGenre, getBooksByAuthor } from "@/services/bookService";
import { BookGrid } from "@/components/BookGrid";
import { Book } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function BrowseBooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const genreParam = searchParams.get("genre");
  const authorParam = searchParams.get("author");

  useEffect(() => {
    // Load all data
    const allBooks = getAllBooks();
    setBooks(allBooks);
    setGenres(getAllGenres());
    setAuthors(getAllAuthors());
    
    // Apply filters based on URL parameters
    if (genreParam) {
      setFilteredBooks(getBooksByGenre(genreParam));
    } else if (authorParam) {
      setFilteredBooks(getBooksByAuthor(authorParam));
    } else {
      setFilteredBooks(allBooks);
    }
  }, [genreParam, authorParam]);

  const handleGenreClick = (genre: string) => {
    setSearchParams({ genre });
  };

  const handleAuthorClick = (author: string) => {
    setSearchParams({ author });
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchTerm("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      const results = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBooks(results);
    } else {
      setFilteredBooks(books);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-book-primary mb-8">Browse Books</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <div className="sticky top-24">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-book-accent/20"
                />
                <Button type="submit" className="ml-2 bg-book-primary hover:bg-book-secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            {(genreParam || authorParam) && (
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="w-full border-book-primary text-book-primary hover:bg-book-accent/10"
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Genres Filter */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Genres</h2>
              <div className="space-y-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      genreParam === genre
                        ? "bg-book-accent text-book-primary font-medium"
                        : "hover:bg-book-accent/10 text-book-secondary"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Authors Filter */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Authors</h2>
              <div className="space-y-2">
                {authors.map((author) => (
                  <button
                    key={author}
                    onClick={() => handleAuthorClick(author)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      authorParam === author
                        ? "bg-book-accent text-book-primary font-medium"
                        : "hover:bg-book-accent/10 text-book-secondary"
                    }`}
                  >
                    {author}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Books Grid */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              {genreParam 
                ? `${genreParam} Books` 
                : authorParam 
                  ? `Books by ${authorParam}` 
                  : searchTerm.trim() 
                    ? "Search Results" 
                    : "All Books"}
            </h2>
            <p className="text-muted-foreground">
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
            </p>
          </div>

          <BookGrid books={filteredBooks} />
        </div>
      </div>
    </div>
  );
}
