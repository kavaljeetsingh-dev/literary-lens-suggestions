
import { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { StarIcon } from "@/components/StarRating";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/book/${book.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col hover:-translate-y-1">
        <div className="aspect-[2/3] overflow-hidden">
          <img 
            src={book.coverImage} 
            alt={`Cover for ${book.title}`} 
            className="book-cover w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
          
          {book.rating && (
            <div className="flex items-center mt-auto">
              <div className="flex mr-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star}
                    filled={star <= Math.round(book.rating || 0)}
                    className="w-4 h-4 text-book-accent"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({book.rating.toFixed(1)})</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {book.genre.slice(0, 2).map((genre) => (
              <span 
                key={genre} 
                className="text-xs px-2 py-1 bg-book-accent/20 text-book-primary rounded-full"
              >
                {genre}
              </span>
            ))}
            {book.genre.length > 2 && (
              <span className="text-xs px-2 py-1 bg-book-accent/20 text-book-primary rounded-full">
                +{book.genre.length - 2}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
