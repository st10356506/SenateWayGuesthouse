import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Firebase
vi.mock('./firebaseConfig', () => ({
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

vi.mock('./lib/analytics', () => ({
  trackUserInteraction: vi.fn(() => Promise.resolve()),
  initializeAnalytics: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({} as any)),
  signOut: vi.fn(() => Promise.resolve()),
}));

describe('App Component Tests', () => {
  it('should render the header', () => {
    const { container } = render(<App />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render the footer', () => {
    const { container } = render(<App />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render the main content area', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should display home page content on load', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main.children.length).toBeGreaterThan(0);
  });

  it('should have the correct layout structure', () => {
    const { container } = render(<App />);
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass('min-h-screen');
  });
});
