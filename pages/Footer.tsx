import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white mb-4">Senate Way Guesthouse</h3>
            <p className="text-white/80 text-sm mb-4">
              Your home away from home in the heart of Kimberley. Experience comfort, hospitality, and exceptional service.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Rooms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facilities</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>

          {/* Popular Facilities */}
          <div>
            <h4 className="text-white mb-4">Popular Facilities</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Free WiFi</li>
              <li>Free Parking</li>
              <li>Swimming Pool</li>
              <li>Air Conditioning</li>
              <li>BBQ Facilities</li>
              <li>Non-smoking Rooms</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>10 Senate Way, 8345 Kimberley, Northern Cape, South Africa</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+27 82 927 8907</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>vanessa141169@yahoo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/80">
          <p>&copy; 2025 Senate Way Guesthouse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
