import { useState, useEffect } from 'react';
import { Header } from './pages/Header';
import { Hero } from './pages/Hero';
import { About } from './pages/About';
import { Rooms } from './pages/Rooms';
import { Gallery } from './pages/Gallery';
import { Reviews } from './pages/Review';
import { Map } from './pages/Map';
import { Contact } from './pages/Contact';
import { Chatbot } from './pages/Chatbot';
import { Footer } from './pages/Footer';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './pages/admin/ProtectedRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { initializeAnalytics, trackUserInteraction } from './lib/analytics';
import './styles/global.css';
import app from './firebaseConfig';

console.log("Firebase initialized:", app.name);

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Initialize analytics and track user interaction
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Track navigation changes as page views
  useEffect(() => {
    if (currentPage !== 'admin') {
      trackUserInteraction('pageView');
    }
  }, [currentPage]);

  // Track clicks on interactive elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Track clicks on buttons, links, and interactive elements
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        trackUserInteraction('click');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Check if we're on the admin route (using hash or query parameter)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setCurrentPage('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check if we're on the admin route
  const isAdminRoute = currentPage === 'admin' || window.location.hash === '#admin' || window.location.search.includes('admin=true');

  if (isAdminRoute) {
    return (
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <About />
          </>
        );
      case 'rooms':
        return <Rooms />;
      case 'gallery':
        return <Gallery />;
      case 'reviews':
        return <Reviews />;
      case 'map':
        return <Map />;
      case 'contact':
        return <Contact />;
      case 'chatbot':
        return <Chatbot />;
      default:
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <About />
          </>
        );
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <main>
            {renderPage()}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
