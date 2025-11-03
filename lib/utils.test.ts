import { describe, it, expect } from 'vitest';
import { cn } from './utils';

/**
 * Test Suite for cn() utility function
 * 
 * Following TDD approach:
 * 1. RED: Write failing tests first
 * 2. GREEN: Implement code to pass tests
 * 3. REFACTOR: Improve code while keeping tests green
 */
describe('cn utility function', () => {
  describe('Basic class merging', () => {
    it('should merge multiple class names', () => {
      // Arrange: Set up test data
      const class1 = 'px-4';
      const class2 = 'py-2';
      const class3 = 'bg-blue';

      // Act: Execute the function
      const result = cn(class1, class2, class3);

      // Assert: Verify the expected outcome
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('bg-blue');
    });

    it('should handle empty input', () => {
      // Arrange: No input provided
      
      // Act: Call function with no arguments
      const result = cn();

      // Assert: Should return empty string or handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle single class name', () => {
      // Arrange
      const className = 'container';

      // Act
      const result = cn(className);

      // Assert
      expect(result).toBe('container');
    });
  });

  describe('Tailwind class conflict resolution', () => {
    it('should resolve conflicting Tailwind classes', () => {
      // Arrange: Conflicting padding classes
      const conflictingClasses = 'px-4 px-8';

      // Act
      const result = cn(conflictingClasses);

      // Assert: Should resolve to the last one (px-8) via tailwind-merge
      expect(result).toContain('px-8');
      expect(result).not.toContain('px-4');
    });

    it('should merge conditional classes', () => {
      // Arrange: Conditional classes with ternary
      const isActive = true;
      const baseClasses = 'px-4 py-2';
      const conditionalClass = isActive ? 'bg-blue' : 'bg-gray';

      // Act
      const result = cn(baseClasses, conditionalClass);

      // Assert
      expect(result).toContain('bg-blue');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });
  });

  describe('Array and object handling', () => {
    it('should handle array of classes', () => {
      // Arrange
      const classes = ['px-4', 'py-2', 'rounded'];

      // Act
      const result = cn(...classes);

      // Assert
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded');
    });

    it('should handle object with conditional classes', () => {
      // Arrange
      const isDisabled = false;
      const classes = {
        'px-4': true,
        'py-2': true,
        'opacity-50': isDisabled,
      };

      // Act
      const result = cn(classes);

      // Assert
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).not.toContain('opacity-50');
    });

    it('should handle mixed input types', () => {
      // Arrange
      const stringClass = 'px-4';
      const arrayClass = ['py-2', 'rounded'];
      const conditionalClass = true ? 'bg-blue' : 'bg-gray';

      // Act
      const result = cn(stringClass, arrayClass, conditionalClass);

      // Assert
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded');
      expect(result).toContain('bg-blue');
    });
  });

  describe('Edge cases', () => {
    it('should handle null and undefined values', () => {
      // Arrange
      const validClass = 'px-4';
      const nullValue = null;
      const undefinedValue = undefined;

      // Act
      const result = cn(validClass, nullValue, undefinedValue);

      // Assert: Should ignore null/undefined and only return valid classes
      expect(result).toContain('px-4');
    });

    it('should handle empty strings', () => {
      // Arrange
      const emptyString = '';
      const validClass = 'px-4';

      // Act
      const result = cn(emptyString, validClass);

      // Assert
      expect(result).toContain('px-4');
    });

    it('should handle whitespace-only strings', () => {
      // Arrange
      const whitespace = '   ';
      const validClass = 'px-4';

      // Act
      const result = cn(whitespace, validClass);

      // Assert
      expect(result).toContain('px-4');
    });
  });
});

