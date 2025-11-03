import { ImageWithFallback } from './figma/ImageWithFallback';

const galleryImages = [
  {
    id: 1,
    url: '/images/Senate1.jpg',
    title: 'Main Exterior View',
    category: 'Exterior',
  },
  {
    id: 2,
    url: '/images/Senate2.jpg',
    title: 'Pool View',
    category: 'Exterior',
  },
  {
    id: 3,
    url: '/images/Senate3.jpg',
    title: 'Braai Area',
    category: 'Exterior',
  },
  {
    id: 4,
    url: '/images/Senate4.jpg',
    title: 'Dining Room',
    category: 'Facilities',
  },
  {
    id: 5,
    url: '/images/Senate5.jpg',
    title: 'Kitchen',
    category: 'Facilities',
  },
  {
    id: 6,
    url: '/images/Senate6.jpg',
    title: 'Kitchen',
    category: 'Facilities',
  },
  {
    id: 7,
    url: '/images/Senate7.jpg',
    title: 'Facilities Signage',
    category: 'Facilities',
  },
  {
    id: 8,
    url: '/images/Senate8.jpg',
    title: 'Bathroom Amenities',
    category: 'Facilities',
  },
  {
    id: 9,
    url: '/images/Senate9.jpg',
    title: 'Room 1',
    category: 'Rooms',
  },
  {
    id: 10,
    url: '/images/Senate10.jpg',
    title: 'Deluxe Room',
    category: 'Rooms',
  },
  {
    id: 11,
    url: '/images/Senate11.jpg',
    title: 'Family Room',
    category: 'Rooms',
  },
  {
    id: 12,
    url: '/images/Senate12.jpg',
    title: 'Executive Suite',
    category: 'Rooms',
  },
  {
    id: 13,
    url: '/images/Senate13.jpg',
    title: 'Modern Bathroom',
    category: 'Rooms',
  },
  {
    id: 14,
    url: '/images/Senate14.jpg',
    title: 'Kitchen Facilities',
    category: 'Facilities',
  },
  {
    id: 15,
    url: '/images/Senate15.jpg',
    title: 'Outdoor Seating',
    category: 'Facilities',
  },
  {
    id: 16,
    url: '/images/Senate16.jpg',
    title: 'Garden Patio',
    category: 'Exterior',
  },
  {
    id: 17,
    url: '/images/Senate17.jpg',
    title: 'Parking Area',
    category: 'Facilities',
  },
  {
    id: 18,
    url: '/images/Senate18.jpg',
    title: 'Sun Terrace',
    category: 'Facilities',
  },
  {
    id: 19,
    url: '/images/Senate19.jpg',
    title: 'Twin Room',
    category: 'Rooms',
  },
  {
    id: 20,
    url: '/images/Senate20.jpg',
    title: 'Double Room',
    category: 'Rooms',
  },
  {
    id: 21,
    url: '/images/Senate21.jpg',
    title: 'Single Room',
    category: 'Rooms',
  },
  {
    id: 22,
    url: '/images/Senate22.jpg',
    title: 'Room Interior',
    category: 'Rooms',
  },
  {
    id: 23,
    url: '/images/Senate23.jpg',
    title: 'Room Amenities',
    category: 'Rooms',
  },
  {
    id: 24,
    url: '/images/Senate24.jpg',
    title: 'Balcony View',
    category: 'Rooms',
  },
  {
    id: 25,
    url: '/images/Senate25.jpg',
    title: 'Property Grounds',
    category: 'Exterior',
  },
  {
    id: 26,
    url: '/images/Senate26.jpg',
    title: 'Outdoor Space',
    category: 'Exterior',
  },
  {
    id: 27,
    url: '/images/Senate27.jpg',
    title: 'Recreation Area',
    category: 'Facilities',
  },
  {
    id: 28,
    url: '/images/Senate28.jpg',
    title: 'Common Area',
    category: 'Facilities',
  },
  {
    id: 29,
    url: '/images/Senate29.jpg',
    title: 'Guesthouse Overview',
    category: 'Exterior',
  },
];

export function Gallery() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-4">Photo Gallery</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Take a virtual tour of our beautiful guesthouse and discover what awaits you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-lg group cursor-pointer ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <ImageWithFallback
                src={image.url}
                alt={image.title}
                className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                  index === 0 ? 'h-[600px]' : 'h-[290px]'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm text-white/90">{image.category}</p>
                  <h3 className="text-white">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}