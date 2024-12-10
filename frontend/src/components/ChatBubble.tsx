import React from "react";
import botAvatar from "../assets/bot.png";
import userAvatar from "../assets/user.png";

interface ChatBubbleProps {
  role: string;
  content: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-center my-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full mr-2" />
      )}
      <div
        className={`p-2 rounded-lg max-w-xs ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        {content}
      </div>
      {isUser && (
        <img
          src={userAvatar}
          alt="User"
          className="w-8 h-8 rounded-full ml-2"
        />
      )}
    </div>
  );
};

export default ChatBubble;
