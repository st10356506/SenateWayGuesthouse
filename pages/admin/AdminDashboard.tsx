import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Analytics } from './Analytics';
import { Bookings } from './Bookings';
import { LogOut, BarChart3, Calendar } from 'lucide-react';

export function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings'>('analytics');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              className="rounded-b-none"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'bookings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('bookings')}
              className="rounded-b-none"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main>
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'bookings' && <Bookings />}
      </main>
    </div>
  );
}

