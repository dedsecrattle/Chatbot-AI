import { useState, useEffect, useRef } from "react";
import { sendMessage, delay } from "../api/chat.ts";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import { Card } from "@/components/ui/card";
import ChatHeader from "./ChatHeader.tsx";

const ChatWindow = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isTyping, setIsTyping] = useState(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    const userMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    await delay(2000);

    const response = await sendMessage(content);

    if (response) {
      const botMessage = {
        role: "assistant",
        content: response?.answer,
      };
      setMessages((prev) => [...prev, botMessage]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I cannot answer this question." },
      ]);
    }

    setIsTyping(false);
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <Card className="p-4 max-w-xl mx-auto mt-10">
      <ChatHeader />
      <div className="h-96 overflow-y-auto mb-4 bg-gray-50 p-2 rounded-md">
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isTyping && (
          <div className="text-left my-2">
            <div className="inline-block p-2 rounded-lg bg-gray-300">
              <span className="animate-pulse">
                Typing<span className="dots">...</span>
              </span>
            </div>
          </div>
        )}
        {/* Invisible element to scroll into view */}
        <div ref={endOfMessagesRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </Card>
  );
};

export default ChatWindow;
