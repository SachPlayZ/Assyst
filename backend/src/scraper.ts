import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScraperError, UrlSchema } from './error-handling';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    // Validate URL
    UrlSchema.parse(url);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 20000 // 10-second timeout
    });

    const $ = cheerio.load(response.data);
    
    // More sophisticated content extraction
    const contentSelectors = [
      'article', 
      'main', 
      '.content', 
      '#content', 
      '.article-body', 
      'body'
    ];

    let pageText = '';
    for (const selector of contentSelectors) {
      const content = $(selector).text()
        .replace(/\s+/g, ' ')
        .trim();
      
      if (content.length > pageText.length) {
        pageText = content;
      }
    }

    // Limit text to prevent overwhelming LLM
    return pageText.substring(0, 5000);
  } catch (error) {
    throw new ScraperError(`Failed to scrape ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}