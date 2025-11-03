import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Slider } from './ui/slider';
import { Users, Bed, Bath } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { database } from '../firebaseConfig';
import { ref, push } from 'firebase/database';

interface Room {
  id: number;
  name: string;
  size: string;
  capacity: number;
  beds: string;
  price: number;
  image: string;
  amenities: string[];
}

const rooms: Room[] = [
  {
    id: 1,
    name: 'Standard Single Room',
    size: 'small',
    capacity: 1,
    beds: '1 Single Bed',
    price: 450,
    image: 'images/Senate14.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Coffee Maker'],
  },
  {
    id: 2,
    name: 'Standard Double Room',
    size: 'medium',
    capacity: 2,
    beds: '1 Double Bed',
    price: 650,
    image: 'images/Senate11.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Coffee Maker'],
  },
  {
    id: 3,
    name: 'Deluxe Double Room',
    size: 'large',
    capacity: 2,
    beds: '1 Queen Bed',
    price: 850,
    image: 'images/Senate20.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Mini Fridge', 'Coffee Maker', 'Pool View', 'Coffee Maker'],
  },
  {
    id: 4,
    name: 'Twin Room',
    size: 'medium',
    capacity: 2,
    beds: '2 Single Beds',
    price: 700,
    image: 'images/Senate17.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Coffee Maker'],
  },
  {
    id: 5,
    name: 'Family Room',
    size: 'large',
    capacity: 4,
    beds: '1 Double + 2 Singles',
    price: 1200,
    image: 'images/Senate20.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Mini Fridge', 'Coffee Maker'],
  },
  {
    id: 6,
    name: 'Superior Room',
    size: 'large',
    capacity: 2,
    beds: '1 King Bed',
    price: 950,
    image: 'images/Senate18.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Mini Fridge', 'Coffee Maker'],
  },
  {
    id: 7,
    name: 'Economy Single Room',
    size: 'small',
    capacity: 1,
    beds: '1 Single Bed',
    price: 400,
    image: 'images/Senate23.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Shared Bathroom', 'Coffee Maker'],
  },
  {
    id: 8,
    name: 'Deluxe Twin Room',
    size: 'medium',
    capacity: 2,
    beds: '2 Single Beds',
    price: 800,
    image: 'images/Senate29.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Mini Fridge', 'Coffee Maker'],
  },
  {
    id: 9,
    name: 'Executive Suite',
    size: 'large',
    capacity: 2,
    beds: '1 King Bed',
    price: 1400,
    image: 'images/Senate14.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Mini Fridge', 'Coffee Maker', 'Balcony'],
  },
  {
    id: 10,
    name: 'Family Suite',
    size: 'large',
    capacity: 5,
    beds: '2 Double Beds + 1 Single',
    price: 1600,
    image: 'images/Senate10.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom', 'TV', 'Mini Fridge', 'Coffee Maker', 'Living Area'],
  },
];

export function Rooms() {
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [capacityFilter, setCapacityFilter] = useState<number[]>([1]);
  const [priceRange, setPriceRange] = useState<number[]>([1600]);

  const filteredRooms = rooms.filter((room) => {
    const sizeMatch = sizeFilter === 'all' || room.size === sizeFilter;
    const capacityMatch = room.capacity >= capacityFilter[0];
    const priceMatch = room.price <= priceRange[0];
    return sizeMatch && capacityMatch && priceMatch;
  });

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-4">Our Rooms</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Choose from our selection of 10 comfortable rooms, each designed to make your stay memorable
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2">Room Size</label>
              <Select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
                <option value="all">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Select>
            </div>

            <div className="min-h-[60px]">
              <label className="block mb-2">Minimum Capacity: {capacityFilter[0]} guest(s)</label>
              <div className="px-2">
                <Slider
                  value={capacityFilter}
                  onValueChange={setCapacityFilter}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="min-h-[60px]">
              <label className="block mb-2">Max Price: R{priceRange[0]}</label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1600}
                  min={400}
                  step={50}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSizeFilter('all');
                setCapacityFilter([1]);
                setPriceRange([1600]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded">
                  R{room.price}/night
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-3">{room.name}</h3>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    <span>{room.beds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4" />
                    <span>Private Bath</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary text-sm rounded">
                      {amenity}
                    </span>
                  ))}
                </div>

                <Button 
                  className="w-full"
                  onClick={async () => {
                    // Save to Firebase
                    const bookingData = {
                      roomName: room.name,
                      roomId: room.id,
                      price: room.price,
                      capacity: room.capacity,
                      status: 'pending',
                      timestamp: new Date().toISOString(),
                      created: Date.now(),
                      source: 'rooms_page'
                    };
                    try {
                      await push(ref(database, 'bookings'), bookingData);
                      alert(`Thank you for your interest in the ${room.name}! Please fill out the contact form to complete your booking.`);
                    } catch (error) {
                      console.error('Error saving booking:', error);
                    }
                  }}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms match your filters. Try adjusting your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
