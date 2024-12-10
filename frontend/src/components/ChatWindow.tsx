import { useState, useEffect, useRef } from "react";
import { sendMessage, delay } from "../api/chat";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { Card } from "@/components/ui/card";
import "regenerator-runtime";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis is not supported in this browser.");
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleBotResponse = async (userContent: string) => {
    try {
      await delay(2000); // Simulate delay for typing effect
      const response = await sendMessage(userContent);

      const botMessage: Message = {
        role: "assistant",
        content: response?.answer || "Sorry, I cannot answer this question.",
      };

      addMessage(botMessage);
      speak(botMessage.content);
    } catch (error) {
      const errorMessage = "An error occurred. Please try again.";
      addMessage({ role: "assistant", content: errorMessage });
      speak(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    const userMessage: Message = { role: "user", content };
    addMessage(userMessage);
    setIsTyping(true);
    await handleBotResponse(content);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <Card className="p-4 max-w-xl mx-auto mt-10 w-full">
      <ChatHeader />
      <div className="h-96 overflow-y-auto mb-4 bg-gray-50 p-2 rounded-md">
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isTyping && (
          <div className="text-left my-2">
            <div className="inline-block p-2 rounded-lg bg-gray-300">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="flex gap-2 items-center">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </Card>
  );
};

export default ChatWindow;
