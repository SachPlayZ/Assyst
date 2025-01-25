import { z } from 'zod';

// Input validation schemas
export const SearchQuerySchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters long"),
  numResults: z.number().min(1).max(20).optional().default(5)
});

export const UrlSchema = z.string().url("Invalid URL format");

// Custom error classes for more specific error handling
export class SearchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SearchError';
  }
}

export class ScraperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScraperError';
  }
}

export class LLMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LLMError';
  }
}

// Centralized error logging utility
export function logError(error: unknown, context: string = 'Unknown') {
  if (error instanceof Error) {
    console.error(`[${context} Error]`, {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  } else {
    console.error(`[${context} Unknown Error]`, error);
  }
}

// Input validation helper
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}