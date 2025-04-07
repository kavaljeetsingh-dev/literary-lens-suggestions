
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById, getReviewsByBookId, addReview, getSimilarBooks } from "@/services/bookService";
import { Book, Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating, ReadOnlyStarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { BookGrid } from "@/components/BookGrid";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For new review
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Book ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      const fetchedBook = getBookById(id);
      if (!fetchedBook) {
        setError("Book not found");
        setIsLoading(false);
        return;
      }

      setBook(fetchedBook);
      setReviews(getReviewsByBookId(id));
      setSimilarBooks(getSimilarBooks(id));
      setIsLoading(false);
    } catch (err) {
      setError("Error loading book details");
      setIsLoading(false);
    }
  }, [id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    if (!username.trim()) {
      toast({ title: "Error", description: "Please enter your name", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Error", description: "Please select a rating", variant: "destructive" });
      return;
    }

    try {
      const newReview = addReview({
        bookId: id,
        username: username.trim(),
        rating,
        comment,
      });
      
      setReviews([newReview, ...reviews]);
      setUsername("");
      setRating(0);
      setComment("");
      
      // Update the book with the new rating
      const updatedBook = getBookById(id);
      if (updatedBook) {
        setBook(updatedBook);
      }
      
      toast({ title: "Success", description: "Your review has been added" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to add review", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-book-accent/20 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-book-accent/20 rounded w-1/4 mx-auto mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 h-96 bg-book-accent/20 rounded"></div>
            <div className="w-full md:w-2/3">
              <div className="h-4 bg-book-accent/20 rounded w-full mb-4"></div>
              <div className="h-4 bg-book-accent/20 rounded w-full mb-4"></div>
              <div className="h-4 bg-book-accent/20 rounded w-3/4 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-book-primary mb-4">
          {error || "Book not found"}
        </h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the book you're looking for.
        </p>
        <Link to="/browse">
          <Button className="bg-book-primary hover:bg-book-secondary">
            Browse Books
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/browse" className="text-book-secondary hover:text-book-primary mb-4 inline-block">
          ← Back to Browse
        </Link>
      </div>

      {/* Book Details */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Book Cover */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <img 
            src={book.coverImage} 
            alt={`Cover for ${book.title}`} 
            className="book-cover w-full rounded-lg shadow-md"
          />
        </div>

        {/* Book Info */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-3xl font-bold text-book-primary mb-2">{book.title}</h1>
          <p className="text-xl text-book-secondary mb-4">by {book.author}</p>
          
          <div className="flex items-center mb-4">
            {book.rating && (
              <>
                <ReadOnlyStarRating rating={book.rating} size="lg" />
                <span className="ml-2 text-muted-foreground">
                  ({book.rating.toFixed(1)}) · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {book.genre.map((genre) => (
              <Link 
                key={genre} 
                to={`/browse?genre=${encodeURIComponent(genre)}`}
                className="px-3 py-1 bg-book-accent/20 text-book-primary rounded-full text-sm hover:bg-book-accent/30 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>

          {book.publicationYear && (
            <p className="mb-4 text-muted-foreground">
              Published: {book.publicationYear}
            </p>
          )}

          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>

      {/* Similar Books */}
      {similarBooks.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
          <BookGrid books={similarBooks} />
        </section>
      )}

      {/* Reviews Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

        {/* Add Review Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full sm:w-1/2"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Rating
                </label>
                <StarRating rating={rating} onChange={setRating} size="lg" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium mb-1">
                  Your Review (Optional)
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  className="min-h-32"
                />
              </div>
              
              <Button type="submit" className="bg-book-primary hover:bg-book-secondary">
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">{review.username}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-3">
                    <ReadOnlyStarRating rating={review.rating} />
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review this book!
          </p>
        )}
      </section>
    </div>
  );
}
