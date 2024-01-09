"use client";

import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MessageBox from "./MessageBox";
import useConversation from "@/app/hooks/useConversation";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await axios.delete(`/api/messages/${messageId}`);
      if (response.status === 200) {
        setMessages((current) =>
          current.filter((message) => message.id !== messageId)
        );
      }

      bottomRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          onDelete={() => handleDeleteMessage(message.id)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default Body;