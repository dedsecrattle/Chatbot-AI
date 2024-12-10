import ChatWindow from "./components/ChatWindow.tsx";

const App = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        DeviceCare ChatBot
      </h1>
      <ChatWindow />
    </div>
  );
};

export default App;
