import { Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface IChat extends Document {
    _id: string;
  userId?: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryResponse {
  response: string;
  extendedSearch: boolean;
}
