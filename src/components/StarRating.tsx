
import { cn } from "@/lib/utils";

interface StarIconProps {
  filled: boolean;
  className?: string;
  onClick?: () => void;
}

export function StarIcon({ filled, className, onClick }: StarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-5 h-5", className)}
      onClick={onClick}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({ rating, onChange, size = "md", className }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          filled={star <= rating}
          className={cn(
            sizeClasses[size],
            "cursor-pointer text-book-accent",
            star <= rating ? "text-book-accent" : "text-muted"
          )}
          onClick={() => onChange?.(star)}
        />
      ))}
    </div>
  );
}

export function ReadOnlyStarRating({ rating, size = "md", className }: Omit<StarRatingProps, "onChange">) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          filled={star <= rating}
          className={cn(
            sizeClasses[size],
            star <= rating ? "text-book-accent" : "text-muted"
          )}
        />
      ))}
    </div>
  );
}
