import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { IChat, IMessage, QueryResponse } from "../@types";
import ChatService from "../services/chatService";

interface ChatContextType {
  chats: IChat[];
  currentChat: IChat | null;
  isLoading: boolean;
  lastQueryExtendedSearch: boolean;
  createNewChat: (userId?: string) => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  sendQuery: (query: string) => Promise<QueryResponse>;
  addMessage: (content: string, role: "user" | "assistant") => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQueryExtendedSearch, setLastQueryExtendedSearch] = useState(false);

  // Fetch all chats on initial load
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const fetchedChats = await ChatService.getAllChats();
        setChats(fetchedChats);
        // Optionally select the most recently updated chat
        if (fetchedChats.length > 0) {
          setCurrentChat(fetchedChats[0]);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const createNewChat = async (userId?: string) => {
    setIsLoading(true);
    try {
      const newChat = await ChatService.createChat(userId);
      setChats((prevChats) => [...prevChats, newChat]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = async (chatId: string) => {
    setIsLoading(true);
    try {
      const selectedChat = await ChatService.getChatById(chatId);
      setCurrentChat(selectedChat);
    } catch (error) {
      console.error("Failed to select chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuery = async (query: string): Promise<QueryResponse> => {
    if (!currentChat) {
      throw new Error("No active chat selected");
    }

    setIsLoading(true);
    try {
      // Send query to backend
      const queryResponse = await ChatService.sendQuery(query, currentChat._id);

      // Refresh current chat to get updated messages
      const updatedChat = await ChatService.getChatById(currentChat._id);

      // Update local state
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );
      setCurrentChat(updatedChat);

      // Track whether extended search was used
      setLastQueryExtendedSearch(queryResponse.extendedSearch);

      return queryResponse;
    } catch (error) {
      console.error("Failed to send query:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = async (content: string, role: "user" | "assistant") => {
    if (!currentChat) return;

    setIsLoading(true);
    try {
      const message: IMessage = { content, role };
      const updatedChat = await ChatService.addMessage(
        currentChat._id,
        message
      );

      // Update chats array and current chat
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );
      setCurrentChat(updatedChat);
    } catch (error) {
      console.error("Failed to add message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoading,
        lastQueryExtendedSearch,
        createNewChat,
        selectChat,
        sendQuery,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
