
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string[];
  description: string;
  coverImage: string;
  rating?: number;
  publicationYear?: number;
}

export interface Review {
  id: string;
  bookId: string;
  username: string;
  rating: number;
  comment: string;
  date: Date;
}
