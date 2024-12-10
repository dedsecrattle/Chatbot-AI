import axios from "axios";

export const sendMessage = async (message: string) => {
  try {
    const response = await axios.post("http://localhost:8000/api/chat", {
      userQuery: message,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
