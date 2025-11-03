import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'map', label: 'Location' },
    { id: 'contact', label: 'Contact' },
    { id: 'chatbot', label: 'AI Assistant' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="py-2 border-b border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                  10 Senate Way, 8345 Kimberley, South Africa

                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                  +27 82 927 8907
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                vanessa141169@yahoo.com
              </span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className="text-primary font-semibold cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              Senate Way Guesthouse
            </h1>
            <p className="text-sm text-muted-foreground">
              Your Home Away From Home
            </p>
          </div>

          <nav className="flex flex-wrap gap-2 items-center">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </Button>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
