import { database } from '../firebaseConfig';
import { ref, get, set, runTransaction } from 'firebase/database';

// Track user interactions
export async function trackUserInteraction(type: 'pageView' | 'click' | 'formSubmit' | 'booking' | 'review') {
  try {
    // Check if this is a new user (using sessionStorage)
    const isNewUser = !sessionStorage.getItem('user_tracked');
    
    if (isNewUser) {
      sessionStorage.setItem('user_tracked', 'true');
      const usersRef = ref(database, 'analytics/totalUsers');
      await runTransaction(usersRef, (current) => {
        return (current || 0) + 1;
      });
    }

    // Update specific metrics using transactions for atomic updates
    let metricPath = '';
    switch (type) {
      case 'pageView':
        metricPath = 'analytics/pageViews';
        break;
      case 'click':
      case 'formSubmit':
        metricPath = 'analytics/interactions';
        break;
      case 'booking':
        metricPath = 'analytics/bookings';
        break;
      case 'review':
        metricPath = 'analytics/reviews';
        break;
    }

    if (metricPath) {
      const metricRef = ref(database, metricPath);
      await runTransaction(metricRef, (current) => {
        return (current || 0) + 1;
      });
    }
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
}

// Initialize analytics if needed
export async function initializeAnalytics() {
  try {
    const analyticsRef = ref(database, 'analytics');
    const snapshot = await get(analyticsRef);
    
    if (!snapshot.exists()) {
      // Initialize with default values
      await set(analyticsRef, {
        totalUsers: 0,
        pageViews: 0,
        interactions: 0,
        bookings: 0,
        reviews: 0,
      });
    }
  } catch (error) {
    console.error('Error initializing analytics:', error);
  }
}

