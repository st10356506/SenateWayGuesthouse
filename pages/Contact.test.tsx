import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Contact } from './Contact';
import * as emailjs from 'emailjs-com';
import { ref, push } from 'firebase/database';

// Mock Firebase
vi.mock('../firebaseConfig', () => ({
  database: {},
  auth: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  push: vi.fn(() => Promise.resolve({ key: 'test-key' })),
  runTransaction: vi.fn(() => Promise.resolve({ committed: true, snapshot: { val: () => 0 } })),
  get: vi.fn(() => Promise.resolve({ exists: () => false, val: () => null })),
  set: vi.fn(() => Promise.resolve()),
}));

vi.mock('emailjs-com', () => ({
  default: {
    send: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

vi.mock('../lib/analytics', () => ({
  trackUserInteraction: vi.fn(() => Promise.resolve()),
  initializeAnalytics: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({} as any)),
  signOut: vi.fn(() => Promise.resolve()),
}));

describe('Contact Form Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display all form fields', () => {
    render(<Contact />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
  });

  it('should show submit button', () => {
    render(<Contact />);
    expect(screen.getByRole('button', { name: /send booking request/i })).toBeInTheDocument();
  });

  it('should update name field when typing', () => {
    render(<Contact />);
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput.value).toBe('John Doe');
  });

  it('should update email field when typing', () => {
    render(<Contact />);
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  it('should update all fields independently', () => {
    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } });
    
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
    
    expect(nameInput.value).toBe('Jane Doe');
    expect(emailInput.value).toBe('jane@example.com');
    expect(phoneInput.value).toBe('9876543210');
  });

  it('should require all mandatory fields', () => {
    render(<Contact />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    
    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
  });

  it('should submit form with valid data', async () => {
    const mockFirebaseRef = {};
    vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
    
    render(<Contact />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2025-12-01' } });
    fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2025-12-05' } });

    // Submit
    const form = document.querySelector('form');
    fireEvent.submit(form!);

    // Check Firebase was called
    await waitFor(() => {
      expect(push).toHaveBeenCalled();
    });
  });

  it('should send email after form submission', async () => {
    const mockFirebaseRef = {};
    vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
    
    render(<Contact />);
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2025-12-01' } });
    fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2025-12-05' } });

    const form = document.querySelector('form');
    fireEvent.submit(form!);

    // Check EmailJS was called
    await waitFor(() => {
      expect(emailjs.default.send).toHaveBeenCalled();
    });
  });

  it('should reset form after successful submission', async () => {
    const mockFirebaseRef = {};
    vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
    
    render(<Contact />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    
    // Submit
    const form = document.querySelector('form');
    fireEvent.submit(form!);

    // Check form was reset
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('');
    });
  });

  it('should handle errors gracefully', async () => {
    const mockFirebaseRef = {};
    vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
    vi.mocked(push).mockRejectedValueOnce(new Error('Firebase error'));

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Contact />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2025-12-01' } });
    fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2025-12-02' } });

    // Submit
    const form = document.querySelector('form');
    fireEvent.submit(form!);

    // Check error was handled
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });
});
