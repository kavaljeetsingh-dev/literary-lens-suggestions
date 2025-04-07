
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook, getAllGenres } from "@/services/bookService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddBook() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const existingGenres = getAllGenres();

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    }
  };

  const handleAddCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      setSelectedGenres([...selectedGenres, customGenre.trim()]);
      setCustomGenre("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a book title", variant: "destructive" });
      return;
    }
    if (!author.trim()) {
      toast({ title: "Error", description: "Please enter an author name", variant: "destructive" });
      return;
    }
    if (selectedGenres.length === 0) {
      toast({ title: "Error", description: "Please select at least one genre", variant: "destructive" });
      return;
    }
    if (!coverImage.trim()) {
      toast({ title: "Error", description: "Please enter a cover image URL", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const yearNumber = publicationYear ? parseInt(publicationYear) : undefined;
      
      const newBook = addBook({
        title: title.trim(),
        author: author.trim(),
        genre: selectedGenres,
        description: description.trim(),
        coverImage: coverImage.trim(),
        publicationYear: yearNumber,
      });
      
      toast({ title: "Success", description: "Book added successfully" });
      navigate(`/book/${newBook.id}`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add book", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-book-primary mb-8">Add a New Book</h1>
      
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-base">
                  Book Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  placeholder="Enter book title"
                  required
                />
              </div>
              
              {/* Author */}
              <div>
                <Label htmlFor="author" className="text-base">
                  Author <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-1"
                  placeholder="Enter author name"
                  required
                />
              </div>
              
              {/* Genres */}
              <div>
                <Label className="text-base">
                  Genres <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {existingGenres.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={(checked) => handleGenreChange(genre, checked === true)}
                      />
                      <Label htmlFor={`genre-${genre}`} className="cursor-pointer">{genre}</Label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex">
                  <Input
                    placeholder="Add custom genre"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    className="mr-2"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddCustomGenre}
                    disabled={!customGenre.trim()}
                  >
                    Add
                  </Button>
                </div>
                {selectedGenres.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedGenres.map((genre) => (
                      <div 
                        key={genre} 
                        className="px-3 py-1 bg-book-accent/20 text-book-primary rounded-full text-sm flex items-center"
                      >
                        {genre}
                        <button
                          type="button" 
                          className="ml-2 text-book-primary hover:text-book-secondary"
                          onClick={() => handleGenreChange(genre, false)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-32"
                  placeholder="Enter book description"
                />
              </div>
              
              {/* Cover Image */}
              <div>
                <Label htmlFor="coverImage" className="text-base">
                  Cover Image URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="mt-1"
                  placeholder="Enter URL to book cover image"
                  required
                />
                {coverImage && (
                  <div className="mt-3">
                    <p className="text-sm mb-2">Preview:</p>
                    <img 
                      src={coverImage} 
                      alt="Cover preview" 
                      className="w-32 h-48 object-cover rounded shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop";
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Publication Year */}
              <div>
                <Label htmlFor="publicationYear" className="text-base">
                  Publication Year
                </Label>
                <Input
                  id="publicationYear"
                  type="number"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                  className="mt-1"
                  placeholder="Enter publication year"
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-book-primary hover:bg-book-secondary w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Book..." : "Add Book"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
