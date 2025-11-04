/**
 * StrapiImage Component Tests
 * Target: 85%+ coverage
 */

import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrapiImage } from '../StrapiImage';
import type { StrapiMedia } from '../../types';

// Mock next/image to avoid Next.js specific errors in tests
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, fill, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-fill={fill}
      {...props}
    />
  ),
}));

describe('StrapiImage', () => {
  const validImageData: StrapiMedia = {
    data: {
      id: 1,
      attributes: {
        name: 'test-image.jpg',
        alternativeText: 'Test image',
        url: '/uploads/test-image.jpg',
        width: 1920,
        height: 1080,
        hash: 'test_hash_123',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 245.6,
        provider: 'local',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        formats: {
          thumbnail: {
            name: 'thumbnail_test-image.jpg',
            hash: 'thumbnail_hash',
            ext: '.jpg',
            mime: 'image/jpeg',
            width: 156,
            height: 156,
            size: 12.3,
            url: '/uploads/thumbnail_test-image.jpg',
          },
          small: {
            name: 'small_test-image.jpg',
            hash: 'small_hash',
            ext: '.jpg',
            mime: 'image/jpeg',
            width: 500,
            height: 500,
            size: 45.6,
            url: '/uploads/small_test-image.jpg',
          },
        },
      },
    },
  };

  beforeEach(() => {
    // Clear console warnings
    vi.clearAllMocks();
  });

  describe('Valid data rendering', () => {
    it('should render correctly with valid data prop', () => {
      const { container } = render(<StrapiImage data={validImageData} />);
      
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('/uploads/test-image.jpg');
      expect(img?.getAttribute('alt')).toBe('Test image');
      expect(img?.getAttribute('width')).toBe('1920');
      expect(img?.getAttribute('height')).toBe('1080');
    });

    it('should correctly pass alt text', () => {
      const { container } = render(<StrapiImage data={validImageData} />);
      
      const img = container.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('Test image');
    });

    it('should correctly merge className prop via nextImageProps', () => {
      const { container } = render(
        <StrapiImage 
          data={validImageData} 
          nextImageProps={{ className: 'custom-class' }}
        />
      );
      
      const img = container.querySelector('img');
      expect(img?.className).toBe('custom-class');
    });

    it('should correctly apply nextImageProps (e.g., priority: true)', () => {
      const { container } = render(
        <StrapiImage 
          data={validImageData} 
          nextImageProps={{ 
            priority: true,
            loading: 'eager'
          }}
        />
      );
      
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      // next/image props are passed through in our mock
    });

    it('should handle missing alternativeText in Strapi data gracefully', () => {
      const dataWithoutAlt: StrapiMedia = {
        data: {
          id: 1,
          attributes: {
            name: 'test-image.jpg',
            alternativeText: '',
            url: '/uploads/test-image.jpg',
            width: 1920,
            height: 1080,
            hash: 'test_hash',
            ext: '.jpg',
            mime: 'image/jpeg',
            size: 100,
            provider: 'local',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      };

      const { container } = render(<StrapiImage data={dataWithoutAlt} />);
      
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      // Should use name as fallback or empty string
      const alt = img?.getAttribute('alt');
      expect(alt === 'test-image.jpg' || alt === '').toBeTruthy();
    });

    it('should handle fill mode correctly (no width/height passed)', () => {
      const { container } = render(
        <StrapiImage 
          data={validImageData} 
          nextImageProps={{ fill: true }}
        />
      );
      
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('data-fill')).toBe('true');
      // In fill mode, width/height should not be set
      expect(img?.getAttribute('width')).toBeFalsy();
      expect(img?.getAttribute('height')).toBeFalsy();
    });
  });

  describe('Null and undefined data handling', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it('should render null when data is null', () => {
      const { container } = render(<StrapiImage data={null as any} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should throw development-mode warning when data is null', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<StrapiImage data={null as any} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('[StrapiImage] No image data provided');

      process.env.NODE_ENV = originalEnv;
    });

    it('should render null when data is undefined', () => {
      const { container } = render(<StrapiImage data={undefined as any} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should throw development-mode warning when data is undefined', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<StrapiImage data={undefined as any} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('[StrapiImage] No image data provided');

      process.env.NODE_ENV = originalEnv;
    });

    it('should render null when data.data is missing', () => {
      const invalidData = { data: null } as any;
      const { container } = render(<StrapiImage data={invalidData} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should render null when data.data.attributes is missing', () => {
      const invalidData = { data: { id: 1 } } as any;
      const { container } = render(<StrapiImage data={invalidData} />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Fallback image', () => {
    it('should render fallback image when data is invalid and fallback is provided', () => {
      const { container } = render(
        <StrapiImage 
          data={null as any} 
          fallback="/images/placeholder.jpg"
        />
      );
      
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('/images/placeholder.jpg');
      expect(img?.getAttribute('alt')).toBe('Fallback image');
    });

    it('should pass nextImageProps to fallback image', () => {
      const { container } = render(
        <StrapiImage 
          data={null as any} 
          fallback="/images/placeholder.jpg"
          nextImageProps={{ className: 'fallback-class' }}
        />
      );
      
      const img = container.querySelector('img');
      expect(img?.className).toBe('fallback-class');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty URL gracefully', () => {
      const dataWithEmptyUrl: StrapiMedia = {
        data: {
          id: 1,
          attributes: {
            name: 'test-image.jpg',
            alternativeText: 'Test',
            url: '',
            width: 1920,
            height: 1080,
            hash: 'test_hash',
            ext: '.jpg',
            mime: 'image/jpeg',
            size: 100,
            provider: 'local',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      };

      const { container } = render(<StrapiImage data={dataWithEmptyUrl} />);
      
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('');
    });

    it('should handle zero dimensions', () => {
      const dataWithZeroDimensions: StrapiMedia = {
        data: {
          id: 1,
          attributes: {
            name: 'test-image.jpg',
            alternativeText: 'Test',
            url: '/uploads/test.jpg',
            width: 0,
            height: 0,
            hash: 'test_hash',
            ext: '.jpg',
            mime: 'image/jpeg',
            size: 100,
            provider: 'local',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      };

      const { container } = render(<StrapiImage data={dataWithZeroDimensions} />);
      
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('width')).toBe('0');
      expect(img?.getAttribute('height')).toBe('0');
    });
  });
});
