
import { Book, Review } from "@/types";

// Sample book data
const sampleBooks: Book[] = [
  {
    id: "1",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: ["Classic", "Romance"],
    description: "Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner. They must overcome the titular sins of pride and prejudice in order to fall in love and marry.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    publicationYear: 1813,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: ["Classic", "Historical Fiction"],
    description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    publicationYear: 1960,
  },
  {
    id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: ["Classic", "Fiction"],
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.2,
    publicationYear: 1925,
  },
  {
    id: "4",
    title: "1984",
    author: "George Orwell",
    genre: ["Dystopian", "Science Fiction"],
    description: "1984 is a dystopian novel by English novelist George Orwell. It was published on 8 June 1949 as Orwell's ninth and final book completed in his lifetime.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    publicationYear: 1949,
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: ["Fantasy", "Adventure"],
    description: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.",
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    publicationYear: 1937,
  },
  {
    id: "6",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: ["Fantasy", "Young Adult"],
    description: "Harry Potter and the Philosopher's Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.",
    coverImage: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    publicationYear: 1997,
  },
];

const sampleReviews: Review[] = [
  {
    id: "1",
    bookId: "1",
    username: "BookLover42",
    rating: 5,
    comment: "A timeless classic that never gets old. Elizabeth Bennet is one of the most relatable characters in literature.",
    date: new Date("2023-01-15"),
  },
  {
    id: "2",
    bookId: "1",
    username: "LiteraryFan",
    rating: 4,
    comment: "Jane Austen's wit and social commentary shine through in this novel.",
    date: new Date("2023-02-20"),
  },
  {
    id: "3",
    bookId: "2",
    username: "ClassicReader",
    rating: 5,
    comment: "This book changed my perspective on so many things. A must-read for everyone.",
    date: new Date("2023-03-10"),
  },
];

let books = [...sampleBooks];
let reviews = [...sampleReviews];
let nextBookId = books.length + 1;
let nextReviewId = reviews.length + 1;

export const getAllBooks = (): Book[] => {
  return books;
};

export const getBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const getBooksByGenre = (genre: string): Book[] => {
  return books.filter(book => book.genre.includes(genre));
};

export const getBooksByAuthor = (author: string): Book[] => {
  return books.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
};

export const searchBooks = (query: string): Book[] => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(
    book => 
      book.title.toLowerCase().includes(lowercaseQuery) || 
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
};

export const addBook = (book: Omit<Book, "id">): Book => {
  const newBook = {
    ...book,
    id: (nextBookId++).toString(),
  };
  books.push(newBook);
  return newBook;
};

export const getReviewsByBookId = (bookId: string): Review[] => {
  return reviews.filter(review => review.bookId === bookId);
};

export const addReview = (review: Omit<Review, "id" | "date">): Review => {
  const newReview = {
    ...review,
    id: (nextReviewId++).toString(),
    date: new Date(),
  };
  reviews.push(newReview);
  
  // Update book rating
  const bookReviews = getReviewsByBookId(review.bookId);
  const totalRating = bookReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / bookReviews.length;
  
  const bookIndex = books.findIndex(book => book.id === review.bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      rating: parseFloat(averageRating.toFixed(1)),
    };
  }
  
  return newReview;
};

export const getSimilarBooks = (bookId: string, limit: number = 4): Book[] => {
  const book = getBookById(bookId);
  if (!book) return [];
  
  // Find books with similar genres
  const similarBooks = books
    .filter(b => b.id !== bookId) // Exclude the current book
    .map(b => {
      // Calculate similarity based on genres
      const genreSimilarity = b.genre.filter(g => book.genre.includes(g)).length;
      // Bonus points if by the same author
      const authorSimilarity = b.author === book.author ? 2 : 0;
      return {
        book: b,
        similarity: genreSimilarity + authorSimilarity,
      };
    })
    .filter(item => item.similarity > 0) // Only include books with some similarity
    .sort((a, b) => b.similarity - a.similarity) // Sort by similarity (descending)
    .slice(0, limit) // Limit the number of results
    .map(item => item.book); // Extract just the books
  
  return similarBooks;
};

export const getAllGenres = (): string[] => {
  const genreSet = new Set<string>();
  books.forEach(book => {
    book.genre.forEach(genre => {
      genreSet.add(genre);
    });
  });
  return Array.from(genreSet).sort();
};

export const getAllAuthors = (): string[] => {
  const authorSet = new Set<string>();
  books.forEach(book => {
    authorSet.add(book.author);
  });
  return Array.from(authorSet).sort();
};
