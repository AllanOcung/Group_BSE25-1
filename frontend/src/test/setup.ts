import { expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Polyfill globals BEFORE anything else
beforeAll(() => {
  if (typeof global !== 'undefined') {
    if (!global.URL) {
      global.URL = URL;
    }
    if (!global.URLSearchParams) {
      global.URLSearchParams = URLSearchParams;
    }
    if (!global.TextEncoder) {
      global.TextEncoder = TextEncoder;
    }
    if (!global.TextDecoder) {
      global.TextDecoder = TextDecoder;
    }
  }
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Extend matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});