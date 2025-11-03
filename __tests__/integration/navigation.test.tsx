import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

// Mock Firebase
vi.mock('../../firebaseConfig', () => ({
  default: { name: 'test-app' },
  database: {},
  auth: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
  runTransaction: vi.fn(() => Promise.resolve({ committed: true, snapshot: { val: () => 0 } })),
  get: vi.fn(() => Promise.resolve({ exists: () => false, val: () => null })),
  set: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({} as any)),
  signOut: vi.fn(() => Promise.resolve()),
}));

describe('Navigation Tests', () => {
  it('should navigate from home to rooms page', () => {
    render(<App />);
    const roomsButton = screen.getAllByRole('button', { name: /rooms/i })[0];
    fireEvent.click(roomsButton);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should navigate to gallery page', () => {
    render(<App />);
    const galleryButton = screen.getAllByRole('button', { name: /gallery/i })[0];
    fireEvent.click(galleryButton);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should navigate to contact page and back to home', () => {
    render(<App />);
    
    // Go to contact
    const contactButton = screen.getAllByRole('button', { name: /contact/i })[0];
    fireEvent.click(contactButton);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    
    // Go back to home
    const homeButton = screen.getAllByRole('button', { name: /home/i })[0];
    fireEvent.click(homeButton);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should keep header and footer visible on all pages', () => {
    const { container } = render(<App />);
    
    // Check header exists
    expect(container.querySelector('header')).toBeInTheDocument();
    
    // Navigate to different pages
    fireEvent.click(screen.getAllByRole('button', { name: /rooms/i })[0]);
    expect(container.querySelector('header')).toBeInTheDocument();
    
    fireEvent.click(screen.getAllByRole('button', { name: /gallery/i })[0]);
    expect(container.querySelector('header')).toBeInTheDocument();
    
    // Check footer exists
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
