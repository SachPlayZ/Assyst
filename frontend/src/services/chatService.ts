import axios from 'axios';
import { IChat, IMessage, QueryResponse } from '../@types';

class ChatService {
  // Base API endpoint - adjust to your backend URL
  private baseUrl = 'http://localhost:3001';

  async createChat(userId?: string): Promise<IChat> {
    try {
      const response = await axios.post<IChat>(`${this.baseUrl}/chats`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async getChatById(chatId: string): Promise<IChat> {
    try {
      const response = await axios.get<IChat>(`${this.baseUrl}/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  }

  async getAllChats(): Promise<IChat[]> {
    try {
      const response = await axios.get<IChat[]>(`${this.baseUrl}/chats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  async sendQuery(query: string, chatId?: string): Promise<QueryResponse> {
    try {
      console.log('Sending query:', query, chatId);
      const response = await axios.post<QueryResponse>(`${this.baseUrl}/query`, { 
        query, 
        chatId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending query:', error);
      throw error;
    }
  }

  async addMessage(chatId: string, message: IMessage): Promise<IChat> {
    try {
      const response = await axios.post<IChat>(
        `${this.baseUrl}/chats/${chatId}/messages`, 
        message
      );
      return response.data;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }
}

export default new ChatService();