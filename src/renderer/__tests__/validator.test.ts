/**
 * Tests for Zod validator utilities
 */

import { describe, it, expect, vi } from 'vitest';
import { validateComponentData } from '../validator';
import { z } from 'zod';

describe('validateComponentData', () => {
  const schema = z.object({
    __component: z.literal('sections.hero'),
    title: z.string(),
    subtitle: z.string().optional(),
  });

  describe('Valid Data', () => {
    it('should validate correct data', () => {
      const data = {
        __component: 'sections.hero',
        title: 'Test Title',
        subtitle: 'Test Subtitle',
      };

      const result = validateComponentData(data, schema, 'sections.hero', 'error');

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate data without optional fields', () => {
      const data = {
        __component: 'sections.hero',
        title: 'Test Title',
      };

      const result = validateComponentData(data, schema, 'sections.hero', 'error');

      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Data', () => {
    it('should fail validation for missing required fields', () => {
      const data = {
        __component: 'sections.hero',
      };

      const result = validateComponentData(data, schema, 'sections.hero', 'error');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail validation for wrong type', () => {
      const data = {
        __component: 'sections.hero',
        title: 123, // Should be string
      };

      const result = validateComponentData(data, schema, 'sections.hero', 'error');

      expect(result.success).toBe(false);
    });
  });

  describe('Validation Modes', () => {
    it('should log error in error mode', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const data = {
        __component: 'sections.hero',
        title: 123,
      };

      validateComponentData(data, schema, 'sections.hero', 'error');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log warning in warn mode', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data = {
        __component: 'sections.hero',
        title: 123,
      };

      validateComponentData(data, schema, 'sections.hero', 'warn');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should not log in silent mode', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data = {
        __component: 'sections.hero',
        title: 123,
      };

      validateComponentData(data, schema, 'sections.hero', 'silent');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });
});
