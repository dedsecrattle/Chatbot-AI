import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  // Handles sending message to the Bot
  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  //Handles sending message to the Bot on pressing Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your question..."
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleSend}>
        <IoSend />
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
