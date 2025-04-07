
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Book className="h-16 w-16 mx-auto mb-4 text-book-primary" />
      <h1 className="text-4xl font-bold mb-4 text-book-primary">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! We couldn't find the page you're looking for.
      </p>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page might have been moved, deleted, or perhaps it never existed in our library.
      </p>
      <Link to="/">
        <Button className="bg-book-primary hover:bg-book-secondary">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
