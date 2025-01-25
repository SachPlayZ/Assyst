import mongoose, { Schema, Document } from 'mongoose';

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface IChat extends Document {
  userId?: string; // Optional if supporting multiple users
  messages: IMessage[];
  context: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true }
});

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: String }, // Optional for multi-user support
    messages: [MessageSchema],
    context: { type: String, default : '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
