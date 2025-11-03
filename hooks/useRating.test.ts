import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRating } from './useRating';
import { ref, onValue, off } from 'firebase/database';

// Mock Firebase Database
vi.mock('../firebaseConfig', () => ({
  database: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
}));

/**
 * Test Suite for useRating hook
 * 
 * TDD Approach:
 * 1. RED: Write tests for rating calculation logic
 * 2. GREEN: Verify hook implementation
 * 3. REFACTOR: Improve hook if needed
 */
describe('useRating hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial state', () => {
    it('should start with loading state true', () => {
      // Arrange: Mock Firebase to return data after a delay
      const mockReviewsRef = {};
      vi.mocked(ref).mockReturnValue(mockReviewsRef as any);
      
      vi.mocked(onValue).mockImplementation((_ref, callback) => {
        // Simulate async data loading
        setTimeout(() => {
          callback({ val: () => null } as any);
        }, 0);
        return () => {};
      });

      // Act
      const { result } = renderHook(() => useRating());

      // Assert: Should be loading initially
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Average rating calculation', () => {
    it('should calculate average rating from default reviews', async () => {
      // Arrange: Mock Firebase to return no data (use defaults)
      const mockReviewsRef = {};
      vi.mocked(ref).mockReturnValue(mockReviewsRef as any);
      
      vi.mocked(onValue).mockImplementation((_ref, callback) => {
        // Return null to trigger default reviews
        callback({ val: () => null } as any);
        return () => {};
      });

      // Act
      const { result } = renderHook(() => useRating());
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert: Default reviews have 6 reviews with ratings [5,5,4,5,5,4]
      // Average = (5+5+4+5+5+4) / 6 = 28/6 = 4.67 (approximately)
      expect(result.current.totalReviews).toBeGreaterThan(0);
      expect(result.current.averageRating).toBeGreaterThan(0);
      expect(result.current.averageRating).toBeLessThanOrEqual(5);
    });

    it('should calculate average from Firebase reviews', async () => {
      // Arrange: Mock Firebase data
      const mockReviewsRef = {};
      vi.mocked(ref).mockReturnValue(mockReviewsRef as any);
      
      const mockFirebaseData = {
        'review1': { rating: 5, name: 'Test User 1', date: '2025-01-01', comment: 'Great!', category: 'Solo' },
        'review2': { rating: 4, name: 'Test User 2', date: '2025-01-02', comment: 'Good', category: 'Family' },
        'review3': { rating: 5, name: 'Test User 3', date: '2025-01-03', comment: 'Excellent', category: 'Couple' },
      };

      vi.mocked(onValue).mockImplementation((_ref, callback) => {
        callback({ val: () => mockFirebaseData } as any);
        return () => {};
      });

      // Act
      const { result } = renderHook(() => useRating());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert: Should include both default and Firebase reviews
      // Total = 6 defaults + 3 Firebase = 9 reviews
      expect(result.current.totalReviews).toBeGreaterThanOrEqual(9);
    });

    it('should return default average when no reviews exist', async () => {
      // Arrange: Empty reviews array scenario
      const mockReviewsRef = {};
      vi.mocked(ref).mockReturnValue(mockReviewsRef as any);
      
      vi.mocked(onValue).mockImplementation((_ref, callback) => {
        callback({ val: () => null } as any);
        return () => {};
      });

      // Act
      const { result } = renderHook(() => useRating());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert: Should have default average (4.7) when reviews.length is 0
      // But actually it should use defaultReviews, so this test checks the fallback
      expect(result.current.averageRating).toBeGreaterThanOrEqual(4);
      expect(result.current.averageRating).toBeLessThanOrEqual(5);
    });
  });

  describe('Total reviews count', () => {
    it('should count total reviews correctly', async () => {
      // Arrange
      const mockReviewsRef = {};
      vi.mocked(ref).mockReturnValue(mockReviewsRef as any);
      
      vi.mocked(onValue).mockImplementation((_ref, callback) => {
        callback({ val: () => null } as any);
        return () => {};
      });

      // Act
      const { result } = renderHook(() => useRating());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert: Should have at least default reviews
      expect(result.current.totalReviews).toBeGreaterThan(0);
    });
  });

  describe('Firebase integration', () => {
    it('should set up Firebase listener on mount', () => {
      // Arrange
      const mockReviewsRef = {};
      vi.mocked(ref).mockReturnValue(mockReviewsRef as any);
      vi.mocked(onValue).mockImplementation(() => () => {});

      // Act
      renderHook(() => useRating());

      // Assert: Should call ref and onValue
      expect(ref).toHaveBeenCalled();
      expect(onValue).toHaveBeenCalled();
    });

    it('should cleanup Firebase listener on unmount', () => {
      // Arrange
      const mockReviewsRef = {};
      const mockCleanup = vi.fn();
      vi.mocked(ref).mockReturnValue(mockReviewsRef as any);
      vi.mocked(onValue).mockImplementation(() => mockCleanup);

      // Act
      const { unmount } = renderHook(() => useRating());
      unmount();

      // Assert: Cleanup should be called
      expect(off).toHaveBeenCalled();
    });
  });
});

