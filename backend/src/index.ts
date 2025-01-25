import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Chat from './models/Chat';
import { googleSearch } from './search';
import { scrapeWebpage } from './scraper';
import { WebSearchLLMAssistant } from './llm';
import { logError } from './error-handling';

// Load environment variables from .env file
dotenv.config();

class WebResearchAssistant {
  // LLM assistant for processing queries
  private llmAssistant: WebSearchLLMAssistant;

  constructor() {
    // Initialize the LLM assistant
    this.llmAssistant = new WebSearchLLMAssistant();
  }

  async handleQuery(userQuery: string, chatId?: string): Promise<{ response: string; extendedSearch: boolean }> {
    try {
      let extendedSearch = false;
      let chatHistory = '';
      let existingWebSources: { url: string; content: string }[] = [];

      // Retrieve chat history and existing web sources if chatId is provided
      if (chatId) {
        const chat = await Chat.findById(chatId);
        if (chat) {
          // Retrieve chat messages
          const recentMessages = chat.messages;
          chatHistory = recentMessages
            .map(message => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}`)
            .join('\n\n');

          // Parse existing context for web sources
          if (chat.context) {
            try {
              existingWebSources = JSON.parse(chat.context);
            } catch (parseError) {
              // If parsing fails, reset context
              chat.context = '';
              await chat.save();
            }
          }
        }
      }

      // Use existing web sources if available, otherwise perform new search
      if (existingWebSources.length === 0) {
        // Perform Google search with limited results
        const searchResults = await googleSearch(userQuery, 5);
        
        // Scrape content from search results concurrently
        const scrapingPromises = searchResults.map(async (result) => {
          try {
            const content = await scrapeWebpage(result.link);
            return { url: result.link, content };
          } catch (error) {
            logError(error, `Scraping ${result.link}`);
            return null;
          }
        });

        // Filter out null results from scraping
        existingWebSources = (await Promise.all(scrapingPromises)).filter(
          (item): item is { url: string; content: string } => item !== null
        );

        // If a chat ID exists, save the web sources to the context
        if (chatId) {
          const chat = await Chat.findById(chatId);
          if (chat) {
            // Store web sources as JSON string in context
            chat.context = JSON.stringify(existingWebSources);
            await chat.save();
          }
        }
      }

      // Combine chat history and scraped web contents
      const combinedContext = [
        chatHistory ? `--- Conversation Context ---\n${chatHistory}\n\n` : '',
        ...existingWebSources.map((item) => 
          `--- Web Source: ${item.url} ---\n${item.content}`
        )
      ].join('\n\n');

      // Query the LLM with combined context
      let response = await this.llmAssistant.queryContext(combinedContext, userQuery);

      // Perform extended search if initial response is incomplete
      if (this.isResponseIncomplete(response) && chatId) {
        const additionalSearchResults = await googleSearch(userQuery, 1);
        if (additionalSearchResults.length > 0) {
          // Scrape additional content
          const additionalContent = await scrapeWebpage(additionalSearchResults[0].link);

          // Update chat context with new web source
          const chat = await Chat.findById(chatId);
          if (chat) {
            // Parse existing context
            const currentSources = chat.context ? JSON.parse(chat.context) : [];
            
            // Add new source
            currentSources.push({
              url: additionalSearchResults[0].link,
              content: additionalContent
            });

            // Save updated context
            chat.context = JSON.stringify(currentSources);
            await chat.save();

            // Create extended context
            const extendedContext = `${combinedContext}\n\n--- Additional Web Source: ${additionalSearchResults[0].link} ---\n${additionalContent}`;
            
            // Requery with extended context
            response = await this.llmAssistant.queryContext(extendedContext, userQuery);

            extendedSearch = true;
          }
        }
      }

      return { response, extendedSearch };
    } catch (error) {
      logError(error, 'Query Handling');
      throw new Error('An error occurred while processing your request.');
    }
  }

  /**
   * Determine if the response indicates insufficient context
   * @param response - LLM's response to the query
   * @returns boolean indicating if more information is needed
   */
  private isResponseIncomplete(response: string): boolean {
    const incompleteIndicators = [
      'not enough context',
      'insufficient information',
      'cannot provide a complete answer'
    ];
    
    return incompleteIndicators.some((indicator) =>
      response.toLowerCase().includes(indicator.toLowerCase())
    );
  }
}

// Create Express application
const app = express();

// Middleware configuration
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS configuration for cross-origin resource sharing
const corsOptions = {
  // Allow all origins during development
  origin: '*', 
  
  // More secure options recommended for production:
  // origin: ['https://yourdomain.com', 'http://localhost:3000'],
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Initialize the web research assistant
const assistant = new WebResearchAssistant();

// MongoDB Connection Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/web-research-assistant';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Chat Endpoints

// Create a new chat
app.post('/chats', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    const chat = new Chat({
      userId,
      messages: [],
      context: '' // Initialize with empty context
    });

    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create a new chat.' });
  }
});

// Get a chat by ID
app.get('/chats/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found.' });
      return;
    }

    res.json(chat);
  } catch (error) {
    console.error('Error retrieving chat:', error);
    res.status(500).json({ error: 'Failed to retrieve chat.' });
  }
});

// Save a message to a chat
app.post('/chats/:id/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, content } = req.body;

    if (!role || !content) {
      res.status(400).json({ error: 'Both role and content are required.' });
      return;
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found.' });
      return;
    }

    chat.messages.push({ role, content });
    chat.updatedAt = new Date();

    const updatedChat = await chat.save();
    res.json(updatedChat);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

// List all chats
app.get('/chats', async (req: Request, res: Response): Promise<void> => {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats.' });
  }
});

// Query Endpoint
app.post('/query', async (req: Request, res: Response): Promise<void> => {
  console.log('Received request body:', req.body);

  const { query, chatId } = req.body;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Query must be a non-empty string.' });
    return;
  }

  try {
    // Pass chatId to handleQuery method
    const { response, extendedSearch } = await assistant.handleQuery(query, chatId);

    // Optionally save the query and response to the chat
    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (chat) {
        chat.messages.push({ role: 'user', content: query });
        chat.messages.push({ role: 'assistant', content: response });
        chat.updatedAt = new Date();
        await chat.save();
      }
    }

    res.json({ response, extendedSearch });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process the query. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web Research Assistant API running on http://localhost:${PORT}`);
});

export default app;