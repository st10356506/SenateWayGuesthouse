import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { database } from '../../firebaseConfig';
import { ref, onValue, off } from 'firebase/database';
import { Users, Eye, MousePointerClick, Calendar, MessageSquare, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  pageViews: number;
  interactions: number;
  bookings: number;
  reviews: number;
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    pageViews: 0,
    interactions: 0,
    bookings: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics from Firebase
    const analyticsRef = ref(database, 'analytics');
    
    const unsubscribe = onValue(analyticsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAnalytics({
          totalUsers: data.totalUsers || 0,
          pageViews: data.pageViews || 0,
          interactions: data.interactions || 0,
          bookings: data.bookings || 0,
          reviews: data.reviews || 0,
        });
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      off(analyticsRef);
    };
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Page Views',
      value: analytics.pageViews,
      icon: Eye,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Interactions',
      value: analytics.interactions,
      icon: MousePointerClick,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Total Bookings',
      value: analytics.bookings,
      icon: Calendar,
      color: 'bg-orange-500/10 text-orange-500',
    },
    {
      title: 'Reviews',
      value: analytics.reviews,
      icon: MessageSquare,
      color: 'bg-pink-500/10 text-pink-500',
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your website performance and user engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">User Engagement Rate</span>
            <span className="font-semibold">
              {analytics.totalUsers > 0
                ? ((analytics.interactions / analytics.totalUsers) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Avg. Views per User</span>
            <span className="font-semibold">
              {analytics.totalUsers > 0
                ? (analytics.pageViews / analytics.totalUsers).toFixed(1)
                : 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Conversion Rate (Bookings)</span>
            <span className="font-semibold">
              {analytics.totalUsers > 0
                ? ((analytics.bookings / analytics.totalUsers) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

