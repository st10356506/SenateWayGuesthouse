import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue, off } from 'firebase/database';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  category: string;
}

interface RatingData {
  averageRating: number;
  totalReviews: number;
  isLoading: boolean;
}

// Default reviews as fallback
const defaultReviews: Review[] = [
  { id: '1', name: 'Tumelo Makowa', rating: 5, date: 'October 2025', comment: '...', category: 'Couple' },
  { id: '2', name: 'Sahil Ramesar', rating: 5, date: 'September 2025', comment: '...', category: 'Business Traveler' },
  { id: '3', name: 'Wendy Westhuizen', rating: 4, date: 'September 2025', comment: '...', category: 'Family' },
  { id: '4', name: 'David Moyo', rating: 5, date: 'August 2025', comment: '...', category: 'Solo Traveler' },
  { id: '5', name: 'Lisa Moodley', rating: 5, date: 'August 2025', comment: '...', category: 'Couple' },
  { id: '6', name: 'James Merwe', rating: 4, date: 'July 2025', comment: '...', category: 'Family' },
];

export function useRating(): RatingData {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reviewsRef = ref(database, 'reviews');

    const fetchReviews = () => {
      onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert Firebase data to Review array
          const firebaseReviews: Review[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          // Merge with default reviews
          setReviews([...defaultReviews, ...firebaseReviews]);
        } else {
          setReviews(defaultReviews);
        }
        setIsLoading(false);
      });
    };

    fetchReviews();

    // Cleanup listener on unmount
    return () => {
      off(reviewsRef);
    };
  }, []);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 4.7; // Default average from existing reviews

  return {
    averageRating,
    totalReviews: reviews.length,
    isLoading,
  };
}

