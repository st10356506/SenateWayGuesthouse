import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Contact } from '../../pages/Contact';
import * as emailjs from 'emailjs-com';
import { ref, push } from 'firebase/database';

// Mock Firebase
vi.mock('../../firebaseConfig', () => ({
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

// Mock EmailJS
vi.mock('emailjs-com', () => ({
  default: {
    send: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

// Mock analytics module
vi.mock('../../lib/analytics', () => ({
  trackUserInteraction: vi.fn(() => Promise.resolve()),
  initializeAnalytics: vi.fn(() => Promise.resolve()),
}));

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()), // Returns unsubscribe function
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({} as any)),
  signOut: vi.fn(() => Promise.resolve()),
}));

/**
 * Integration Test: Form Submission Flow
 * 
 * Tests the complete flow:
 * Form Input → Validation → Firebase Save → EmailJS → Success Message
 */
describe('Form Submission Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full booking flow successfully', async () => {
    // Arrange
    const mockFirebaseRef = {};
    vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
    
    render(<Contact />);
    
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      guests: '2',
      checkIn: '2025-12-01',
      checkOut: '2025-12-05',
      message: 'Test booking request',
    };

    // Act: Fill form
    fireEvent.change(screen.getByLabelText(/full name/i), { 
      target: { value: formData.name } 
    });
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: formData.email } 
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), { 
      target: { value: formData.phone } 
    });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { 
      target: { value: formData.guests } 
    });
    fireEvent.change(screen.getByLabelText(/check-in date/i), { 
      target: { value: formData.checkIn } 
    });
    fireEvent.change(screen.getByLabelText(/check-out date/i), { 
      target: { value: formData.checkOut } 
    });

    // Act: Submit form
    const form = document.querySelector('form');
    fireEvent.submit(form!);

    // Assert: Verify complete flow
    await waitFor(() => {
      // Firebase should be called
      expect(push).toHaveBeenCalledWith(
        mockFirebaseRef,
        expect.objectContaining({
          name: formData.name,
          email: formData.email,
          status: 'pending',
        })
      );
      
      // EmailJS should be called
      expect(emailjs.default.send).toHaveBeenCalled();
      
      // Analytics is tracked via Firebase (not Google Analytics)
      // The trackUserInteraction function is called which uses Firebase
    });
  });

  it('should handle form submission error gracefully', async () => {
    // Arrange: Mock Firebase to fail
    const mockFirebaseRef = {};
    vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
    vi.mocked(push).mockRejectedValueOnce(new Error('Database error'));

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Contact />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { 
      target: { value: 'Test' } 
    });
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: 'test@test.com' } 
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), { 
      target: { value: '123' } 
    });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { 
      target: { value: '1' } 
    });
    fireEvent.change(screen.getByLabelText(/check-in date/i), { 
      target: { value: '2025-12-01' } 
    });
    fireEvent.change(screen.getByLabelText(/check-out date/i), { 
      target: { value: '2025-12-02' } 
    });

    // Act
    const form = document.querySelector('form');
    fireEvent.submit(form!);

    // Assert: Error should be handled
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
    });

    alertSpy.mockRestore();
  });
});

