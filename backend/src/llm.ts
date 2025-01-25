import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from 'dotenv';

dotenv.config();

export class WebSearchLLMAssistant {
  private llm: ChatGroq;

  constructor() {
    // Ensure you have GROQ_API_KEY in your .env file
    this.llm = new ChatGroq({
      temperature: 0.2,
      modelName: "llama-3.1-8b-instant"
    });
  }

  async queryContext(context: string, userQuestion: string): Promise<string> {
    // Check if the context is empty or too short
    if (!context || context.trim().length < 100) {
      return "Not enough context I cannot provide a comprehensive answer based on the available information. Additional research or sources would be needed to address this query effectively.";
    }
  
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Carefully evaluate the available context and be transparent about its comprehensiveness . If the context is insufficient, start your response with 'Not enough context'"],
      ["system", "Context: {context}"],
      ["human", "Question: {question}"]
    ]);
  
    const chain = prompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());
  
    const response = await chain.invoke({
      context: context,
      question: userQuestion
    });
  
    // If the response is very short or seems to indicate lack of information, prepend "Not enough context"
    const insufficientResponseIndicators = [
      'i cannot provide',
      'there is not enough',
      'insufficient information',
      'cannot find',
      'no information'
    ];
  
    const lowConfidenceResponse = insufficientResponseIndicators.some(indicator => 
      response.toLowerCase().includes(indicator)
    );
  
    if (lowConfidenceResponse) {
      return `Not enough context , ${response}`;
    }
  
    return response;
  }
  
}