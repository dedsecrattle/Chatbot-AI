import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";
import "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { FaMicrophone } from "react-icons/fa";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const [voiceInput, setVoiceInput] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Update input whenever initialValue changes
  useEffect(() => {
    setInput(voiceInput || "");
  }, [voiceInput]);

  // Handles sending message to the Bot
  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    setVoiceInput(transcript);
  }, [transcript]);

  // Handles sending message to the Bot on pressing Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const stopVoiceRecognition = async () => {
    SpeechRecognition.stopListening();
    console.log("Listening stopped.");

    console.log("Voice Input: ", voiceInput);
    console.log("Transcript: ", transcript);
    if (voiceInput.trim()) {
      onSendMessage(voiceInput);
      setVoiceInput("");
    }
  };

  const startVoiceRecognition = async () => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser does not support Speech Recognition.");
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    console.log("Listening started...");
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
      <Button
        onClick={listening ? stopVoiceRecognition : startVoiceRecognition}
        className={`px-4 py-2 rounded-md ${
          listening ? "bg-red-500 text-white" : "bg-black text-white"
        }`}
      >
        <FaMicrophone />
      </Button>
    </div>
  );
};

export default MessageInput;
