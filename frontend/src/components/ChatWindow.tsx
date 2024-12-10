import { useState, useEffect, useRef } from "react";
import { sendMessage, delay } from "../api/chat.ts";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import { Card } from "@/components/ui/card";
import ChatHeader from "./ChatHeader.tsx";
import botAvatar from "../assets/bot.png";

const ChatWindow = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isTyping, setIsTyping] = useState(false);

  //Ref to scroll into view
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  //Handles sending message to the Bot
  const handleSendMessage = async (content: string) => {
    const userMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulating Bot typing
    await delay(2000);

    // Making API call to send message to the Bot
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
    <Card className="p-4 max-w-xl mx-auto mt-10 w-full">
      <ChatHeader />
      <div className="h-96 overflow-y-auto mb-4 bg-gray-50 p-2 rounded-md">
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isTyping && (
          <div className="text-left my-2">
            <img src={botAvatar} />
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
