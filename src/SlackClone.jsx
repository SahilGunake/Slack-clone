import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessage } from "./redux/slices/messagesSlice";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000");

export default function SlackClone() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.list);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/messages");
        dispatch(setMessages(data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("newMessage", (message) => {
      dispatch(addMessage(message));
    });

    return () => socket.off("newMessage");
  }, [dispatch]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post("http://localhost:4000/api/messages", {
        text: newMessage,
        user: user?.email || "Anonymous",
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.user}</strong>: {msg.text}
        </div>
      ))}
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
}
