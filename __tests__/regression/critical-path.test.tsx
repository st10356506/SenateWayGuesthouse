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
  push: vi.fn(() => Promise.resolve({ key: 'test-key' })),
  runTransaction: vi.fn(() => Promise.resolve({ committed: true, snapshot: { val: () => 0 } })),
  get: vi.fn(() => Promise.resolve({ exists: () => false, val: () => null })),
  set: vi.fn(() => Promise.resolve()),
}));

vi.mock('emailjs-com', () => ({
  default: {
    send: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({} as any)),
  signOut: vi.fn(() => Promise.resolve()),
}));

describe('Critical Path Tests', () => {
  it('should navigate correctly between pages', () => {
    render(<App />);
    
    // Test navigation to different pages
    fireEvent.click(screen.getAllByRole('button', { name: /rooms/i })[0]);
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    fireEvent.click(screen.getAllByRole('button', { name: /gallery/i })[0]);
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    fireEvent.click(screen.getAllByRole('button', { name: /contact/i })[0]);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should always show header and footer', () => {
    const { container } = render(<App />);
    
    expect(container.querySelector('header')).toBeInTheDocument();
    
    fireEvent.click(screen.getAllByRole('button', { name: /rooms/i })[0]);
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('should validate contact form correctly', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /contact/i })[0]);
    
    // Check form fields exist
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    
    // Check required attributes
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('required');
  });

  it('should render all main sections', () => {
    const { container } = render(<App />);
    
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('should handle page changes correctly', () => {
    render(<App />);
    
    const initialMain = screen.getByRole('main');
    expect(initialMain).toBeInTheDocument();
    
    // Change page
    fireEvent.click(screen.getAllByRole('button', { name: /gallery/i })[0]);
    
    const newMain = screen.getByRole('main');
    expect(newMain).toBeInTheDocument();
  });
});
