import axios from 'axios';
import dotenv from 'dotenv';
import { z } from 'zod';

// Add the SearchResult interface back
export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

// Create a Zod schema for SearchResult validation
export const SearchResultSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  link: z.string().url("Invalid URL format"),
  snippet: z.string().optional().default("No snippet available")
});

export async function googleSearch(query: string, numResults: number = 5): Promise<SearchResult[]> {
  try {
    // Validate input
    const validatedInput = z.object({
      query: z.string().min(2, "Search query must be at least 2 characters long"),
      numResults: z.number().min(1).max(20).optional().default(5)
    }).parse({ query, numResults });

    // Validate API key
    if (!process.env.SERPAPI_KEY) {
      throw new Error('SerpAPI key is missing. Please set SERPAPI_KEY in your .env file.');
    }

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',
        q: validatedInput.query,
        api_key: process.env.SERPAPI_KEY,
        num: validatedInput.numResults
      },
      timeout: 10000 // 10-second timeout
    });

    // More robust result mapping with Zod validation
    const searchResults: SearchResult[] = (response.data.organic_results || [])
      .map((result: any) => ({
        title: result.title?.trim() || 'No Title',
        link: result.link?.trim() || '',
        snippet: result.snippet?.trim() || 'No snippet available'
      }))
      .map((result: any) => SearchResultSchema.parse(result)) // Validate each result
      .filter((result: SearchResult) => result.link); // Filter out invalid results

    if (searchResults.length === 0) {
      throw new Error('No search results found');
    }

    return searchResults;
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
}