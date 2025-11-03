import { Button } from './ui/button';
import { Star, Wifi, Utensils, Car } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src='/images/Senate1.jpg'
          alt="SenateWay Guesthouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <div className="flex items-center gap-2 mb-4">
            
              </div>
              <h1 className="text-5xl mb-4 text-white">Welcome to Senate Way Guesthouse</h1>
              <p className="text-xl mb-6 text-white">
                Experience comfort and hospitality in the heart of Kimberley. Your perfect stay awaits with modern amenities and exceptional service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => onNavigate('rooms')}>
                  View Our Rooms
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20" onClick={() => onNavigate('contact')}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Features */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Wifi className="w-8 h-8" />
              <div>
                <p className="text-white">Free WiFi</p>
                <p className="text-sm text-white/80">High-Speed Internet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8" />
              <div>
                <p className="text-white">Free Parking</p>
                <p className="text-sm text-white/80">On-Site Private</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Utensils className="w-8 h-8" />
              <div>
                <p className="text-white">BBQ Facilities</p>
                <p className="text-sm text-white/80">Outdoor Area</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8" />
              <div>
                <p className="text-white">Top Rated</p>
                <p className="text-sm text-white/80">Guest Favorite</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
