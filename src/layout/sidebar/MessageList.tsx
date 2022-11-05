import React, { useContext, useState } from "react";
import ChatBox from "../../components/card/ChatBox";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

//icon

interface MessageListProps {}

const MessageList: React.FC<MessageListProps> = ({}) => {
  const { chats, chatContext } = useContext(Context) as ContextType;

  return (
    <div
      style={{
        position: "fixed",
        right: "2rem",
        bottom: 0,
        display: "flex",
      }}
    >
      {chats.map((chat, index) => {
        return <ChatBox key={index} {...chat} />;
      })}
    </div>
  );
};

export default MessageList;
