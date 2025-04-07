
import { Book } from "@/types";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: Book[];
  title?: string;
}

export function BookGrid({ books, title }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No books found</h2>
        <p className="text-muted-foreground">Try a different search or browse by category.</p>
      </div>
    );
  }

  return (
    <section className="py-6">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {books.map((book) => (
          <div key={book.id} className="h-full">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
