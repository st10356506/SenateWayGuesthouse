import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock window.matchMedia for theme detection
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });

  // Mock window.location for security tests and App component
  // Using delete and reassign to properly override jsdom's location object
  delete (window as any).location;
  (window as any).location = {
    protocol: 'https:',
    hostname: 'localhost',
    pathname: '/',
    href: 'https://localhost/',
    hash: '',
    search: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  };

  // Ensure localStorage is available and clean
  if (typeof Storage === 'undefined') {
    const storage: { [key: string]: string } = {};
    (global as any).localStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach(key => delete storage[key]);
      },
    };
  }
  
  // Mock window.alert for form submission tests
  window.alert = vi.fn();
  
  // Clear localStorage before each test run
  localStorage.clear();
});

// Cleanup after each test case
afterEach(() => {
  cleanup();
  // Clear localStorage after each test
  localStorage.clear();
});

