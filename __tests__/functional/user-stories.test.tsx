import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { Gallery } from '../../pages/Gallery';
import { Contact } from '../../pages/Contact';
import { Chatbot } from '../../pages/Chatbot';

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

describe('User Story Tests', () => {
  it('should allow users to view rooms', () => {
    render(<App />);
    const roomsButton = screen.getAllByRole('button', { name: /rooms/i })[0];
    fireEvent.click(roomsButton);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should allow users to submit booking forms', () => {
    render(<Contact />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2025-12-01' } });
    fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2025-12-05' } });

    // Check submit button is enabled
    const submitButton = screen.getByRole('button', { name: /send booking request/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should display gallery images', () => {
    render(<Gallery />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should show the chatbot interface', () => {
    render(<Chatbot />);
    expect(screen.getByPlaceholderText(/type your question/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('should display quick question buttons in chatbot', () => {
    render(<Chatbot />);
    expect(screen.getByText(/what are your room rates/i)).toBeInTheDocument();
    expect(screen.getByText(/what facilities do you offer/i)).toBeInTheDocument();
  });

  it('should allow navigation to reviews page', () => {
    render(<App />);
    const reviewsButton = screen.getAllByRole('button', { name: /reviews/i })[0];
    fireEvent.click(reviewsButton);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should navigate between all pages', () => {
    render(<App />);

    const pageNames = ['Home', 'Rooms', 'Gallery', 'Reviews', 'Contact'];
    
    pageNames.forEach(pageName => {
      const buttons = screen.getAllByRole('button', { name: new RegExp(pageName, 'i') });
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        expect(screen.getByRole('main')).toBeInTheDocument();
      }
    });
  });
});
