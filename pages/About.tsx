import { Card } from './ui/card';
import { Waves, UtensilsCrossed, MapPin, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRating } from '../hooks/useRating';

export function About() {
  const { averageRating, totalReviews } = useRating();
  const highlights = [
    {
      icon: Waves,
      title: 'Swimming Pool',
      description: 'Year-round outdoor pool with a view and sun terrace',
    },
    {
      icon: UtensilsCrossed,
      title: 'Shared Kitchen',
      description: 'Fully equipped kitchen and BBQ facilities available',
    },
    {
      icon: MapPin,
      title: 'Prime Location',
      description: 'Near major attractions and shopping centers',
    },
    {
      icon: ShieldCheck,
      title: `Rated ${averageRating.toFixed(1)}/5`,
      description: `Based on ${totalReviews} verified guest reviews`,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-4">About Our Property</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            SenateWay Guest House offers the perfect blend of comfort, convenience, and hospitality in Kimberley
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <ImageWithFallback
              src='/images/Senate27.jpg'
              alt="Swimming Pool"
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-4">Comfortable Accommodations</h3>
            <p className="mb-4 text-muted-foreground">
              Senate Way Guest House in Kimberley offers clean and comfortable rooms with air-conditioning, private bathrooms, and modern amenities. Guests enjoy free WiFi, a sun terrace, and a year-round outdoor swimming pool.
            </p>
            <p className="mb-4 text-muted-foreground">
              The guest house features a lounge, outdoor fireplace, shared kitchen, and barbecue facilities. Additional amenities include a pool with a view, patio, and private parking.
            </p>
            <p className="text-muted-foreground">
              Located just 6 km from Kimberley Airport, the property is near North Cape Mall and Diamond Pavilion Shopping Centre, both 1.9 km away. Other attractions include Kimberley Mine Museum (3.4 km) and The Big Hole (3.6 km).
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-secondary p-8 rounded-lg">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-2">

                <p className="text-3xl text-primary">{averageRating.toFixed(1)}</p>
              </div>
              <p className="text-muted-foreground">Overall Rating</p>
              <p className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</p>
            </div>
            <div>
              <p className="text-3xl text-primary mb-2">10</p>
              <p className="text-muted-foreground">Bedrooms</p>
            </div>
            <div>
              <p className="text-3xl text-primary mb-2">4.8</p>
              <p className="text-muted-foreground">Cleanliness Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
