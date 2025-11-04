/**
 * Unit tests for SDK main functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStrapiSDK } from '../index';
import type { StrapiSDKConfig } from '../types';

describe('createStrapiSDK', () => {
  const mockConfig: StrapiSDKConfig = {
    url: 'http://localhost:1337/graphql',
    token: 'test-token',
    defaultLocale: 'en',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SDK Initialization', () => {
    it('should create SDK instance with valid config', () => {
      const sdk = createStrapiSDK(mockConfig);

      expect(sdk).toBeDefined();
      expect(sdk.getPage).toBeDefined();
      expect(sdk.getCollection).toBeDefined();
      expect(sdk.getGlobal).toBeDefined();
      expect(sdk.rawQuery).toBeDefined();
    });

    it('should throw error when URL is missing', () => {
      const invalidConfig = { ...mockConfig, url: '' };

      expect(() => createStrapiSDK(invalidConfig)).toThrow(
        'Strapi URL is required in SDK configuration'
      );
    });

    it('should work without optional token', () => {
      const configWithoutToken = {
        url: mockConfig.url,
      };

      const sdk = createStrapiSDK(configWithoutToken);

      expect(sdk).toBeDefined();
    });

    it('should work without optional defaultLocale', () => {
      const configWithoutLocale = {
        url: mockConfig.url,
        token: mockConfig.token,
      };

      const sdk = createStrapiSDK(configWithoutLocale);

      expect(sdk).toBeDefined();
    });

    it('should accept logging configuration', () => {
      const configWithLogging: StrapiSDKConfig = {
        ...mockConfig,
        logging: {
          queries: true,
          cacheTags: true,
          validation: 'warn',
        },
      };

      const sdk = createStrapiSDK(configWithLogging);

      expect(sdk).toBeDefined();
    });
  });

  describe('Query Methods', () => {
    it('should have getPage method', () => {
      const sdk = createStrapiSDK(mockConfig);

      expect(typeof sdk.getPage).toBe('function');
    });

    it('should have getCollection method', () => {
      const sdk = createStrapiSDK(mockConfig);

      expect(typeof sdk.getCollection).toBe('function');
    });

    it('should have getGlobal method', () => {
      const sdk = createStrapiSDK(mockConfig);

      expect(typeof sdk.getGlobal).toBe('function');
    });

    it('should have rawQuery method', () => {
      const sdk = createStrapiSDK(mockConfig);

      expect(typeof sdk.rawQuery).toBe('function');
    });
  });

  describe('Configuration Handling', () => {
    it('should handle all configuration options', () => {
      const fullConfig: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
        token: 'test-token-123',
        defaultLocale: 'fr',
        logging: {
          queries: true,
          cacheTags: true,
          validation: 'error',
        },
      };

      const sdk = createStrapiSDK(fullConfig);

      expect(sdk).toBeDefined();
      expect(sdk.getPage).toBeDefined();
      expect(sdk.getCollection).toBeDefined();
      expect(sdk.getGlobal).toBeDefined();
      expect(sdk.rawQuery).toBeDefined();
    });

    it('should handle minimal configuration', () => {
      const minimalConfig: StrapiSDKConfig = {
        url: 'http://localhost:1337/graphql',
      };

      const sdk = createStrapiSDK(minimalConfig);

      expect(sdk).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw descriptive error for missing URL', () => {
      expect(() =>
        createStrapiSDK({ url: '' } as StrapiSDKConfig)
      ).toThrow('Strapi URL is required in SDK configuration');
    });

    it('should throw descriptive error for undefined URL', () => {
      expect(() =>
        createStrapiSDK({} as StrapiSDKConfig)
      ).toThrow('Strapi URL is required in SDK configuration');
    });
  });

  describe('Type Safety', () => {
    it('should accept generic type parameter for getPage', () => {
      const sdk = createStrapiSDK(mockConfig);

      // This should compile without errors
      interface PageData {
        id: number;
        attributes: {
          title: string;
        };
      }

      // Type assertion to verify generic works
      const getPageTyped = sdk.getPage<PageData>;
      expect(typeof getPageTyped).toBe('function');
    });

    it('should accept generic type parameter for getCollection', () => {
      const sdk = createStrapiSDK(mockConfig);

      interface CollectionData {
        id: number;
        attributes: {
          name: string;
        };
      }

      const getCollectionTyped = sdk.getCollection<CollectionData>;
      expect(typeof getCollectionTyped).toBe('function');
    });

    it('should accept generic type parameter for getGlobal', () => {
      const sdk = createStrapiSDK(mockConfig);

      interface GlobalData {
        id: number;
        attributes: {
          siteName: string;
        };
      }

      const getGlobalTyped = sdk.getGlobal<GlobalData>;
      expect(typeof getGlobalTyped).toBe('function');
    });
  });
});
