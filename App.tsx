import { useState } from 'react';
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
import './styles/global.css';
import app from './firebaseConfig';

console.log("Firebase initialized:", app.name);

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
    <div className="min-h-screen bg-background text-foreground">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
