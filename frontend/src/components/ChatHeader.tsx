import botavatar from "../assets/bot.png";

const ChatHeader = () => {
  return (
    <div className="flex h-14 items-center justify-center gap-5 mb-4">
      <img src={botavatar} className="h-10" />
      <h1 className="text-2xl font-bold">Jivox</h1>
    </div>
  );
};

export default ChatHeader;
