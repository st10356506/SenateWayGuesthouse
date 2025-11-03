import { Card } from './ui/card';
import { Star, Quote, Plus, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { database } from '../firebaseConfig';
import { ref, push, onValue, off } from 'firebase/database';
import { useState, useEffect } from 'react';
import { trackUserInteraction } from '../lib/analytics';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  category: string;
}

interface ReviewForm {
  name: string;
  rating: number;
  comment: string;
  category: string;
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReviewForm>({
    name: '',
    rating: 5,
    comment: '',
    category: 'Guest',
  });
  // Default reviews as fallback
  const defaultReviews: Review[] = [
    {
      id: '1',
      name: 'Tumelo Makowa',
      rating: 5,
      date: 'October 2025',
      comment: 'Absolutely wonderful stay! The rooms were spotlessly clean and the staff went above and beyond to make us feel welcome. The swimming pool was a highlight, and the location is perfect for exploring Kimberley.',
      category: 'Couple',
    },
    {
      id: '2',
      name: 'Sahil Ramesar',
      rating: 5,
      date: 'September 2025',
      comment: 'Great value for money. The air conditioning worked perfectly, WiFi was fast, and having free parking made everything so convenient. Would definitely recommend to anyone visiting Kimberley.',
      category: 'Business Traveler',
    },
    {
      id: '3',
      name: 'Wendy Westhuizen',
      rating: 4,
      date: 'September 2025',
      comment: 'Lovely guesthouse with excellent facilities. The shared kitchen and BBQ area were great for our family gathering. Close to all major attractions and shopping centers.',
      category: 'Family',
    },
    {
      id: '4',
      name: 'David Moyo',
      rating: 5,
      date: 'August 2025',
      comment: 'The cleanliness and comfort exceeded expectations. Private bathroom was modern and well-maintained. The outdoor terrace is perfect for relaxing after a day of sightseeing.',
      category: 'Solo Traveler',
    },
    {
      id: '5',
      name: 'Lisa Moodley',
      rating: 5,
      date: 'August 2025',
      comment: 'Perfect location near the airport and city center. Staff support was exceptional - they helped us plan our entire itinerary. The rooms are modern and very comfortable.',
      category: 'Couple',
    },
    {
      id: '6',
      name: 'James Merwe',
      rating: 4,
      date: 'July 2025',
      comment: 'Highly rated for good reason. Clean, comfortable, and well-located. The outdoor fireplace area was a nice touch. Will definitely stay here again on our next visit.',
      category: 'Family',
    },
  ];

  // Fetch reviews from Firebase
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
        setLoading(false);
      });
    };

    fetchReviews();

    // Cleanup listener on unmount
    return () => {
      off(reviewsRef);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newReview = {
        name: formData.name.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        category: formData.category,
        date: new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }),
        timestamp: Date.now(),
      };

      // Push to Firebase
      await push(ref(database, 'reviews'), newReview);

      // Track review submission
      trackUserInteraction('review');

      // Reset form
      setFormData({
        name: '',
        rating: 5,
        comment: '',
        category: 'Guest',
      });
      setShowForm(false);
      alert('Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const recentReviews = [...reviews].sort((a, b) => {
    // Sort by timestamp if available (Firebase reviews)
    const aTime = (a as any).timestamp || 0;
    const bTime = (b as any).timestamp || 0;
    return bTime - aTime;
  });

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-4">Guest Reviews</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-6">
            Read what our guests have to say about their experience at SenateWay Guesthouse
          </p>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="default"
            className="mt-4"
          >
            {showForm ? (
              <>
                <Quote className="w-4 h-4 mr-2" />
                Hide Review Form
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Write a Review
              </>
            )}
          </Button>
        </div>

        {/* Review Form */}
        {showForm && (
          <Card className="p-8 mb-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-primary">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="category">Traveler Type</Label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Guest">Guest</option>
                  <option value="Couple">Couple</option>
                  <option value="Family">Family</option>
                  <option value="Business Traveler">Business Traveler</option>
                  <option value="Solo Traveler">Solo Traveler</option>
                  <option value="Group">Group</option>
                </select>
              </div>

              <div>
                <Label>Your Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formData.rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  required
                  rows={5}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: '',
                      rating: 5,
                      comment: '',
                      category: 'Guest',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : (
          <>
            {/* Rating Summary */}
            <Card className="p-8 mb-8 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <p className="text-5xl text-primary">{averageRating.toFixed(1)}</p>
                    <div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => {
                          const filledPercentage = Math.max(0, Math.min(1, (averageRating - i)));
                          const isFull = filledPercentage >= 1;
                          const isPartial = filledPercentage > 0 && filledPercentage < 1;
                          
                          return (
                            <div key={i} className="relative w-5 h-5">
                              <Star className="w-5 h-5 text-gray-300 absolute" />
                              {isFull && (
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 absolute" />
                              )}
                              {isPartial && (
                                <div className="absolute overflow-hidden" style={{ width: `${filledPercentage * 100}%` }}>
                                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on {reviews.length} reviews
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl text-primary">8.8</p>
                    <p className="text-sm text-muted-foreground">Couples</p>
                  </div>
                  <div>
                    <p className="text-2xl text-primary">8.7</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                  <div>
                    <p className="text-2xl text-primary">9.1</p>
                    <p className="text-sm text-muted-foreground">Cleanliness</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReviews.map((review) => (
                <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4>{review.name}</h4>
                      <p className="text-sm text-muted-foreground">{review.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                    <p className="text-sm text-muted-foreground pl-6">{review.comment}</p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
