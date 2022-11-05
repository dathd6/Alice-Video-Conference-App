import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import {
  MessageFragmentFragment,
  useChatMutation,
  useDeleteMessageMutation,
  useMeQuery,
  useMessagesQuery,
  useUpdateMessageMutation,
} from "../../generated/graphql";
import { ChatProps, Context, UserChat } from "../../pages/_app";
import { ContextType } from "../../static/types";

//icon
import SendIcon from "../../../public/icon/paper-plane.svg";

import style from "../../styles/module/chatBox.module.scss";

interface ChatBoxProps extends UserChat {}

interface ChatEditProps {
  message: MessageFragmentFragment;
  isUser: boolean;
  id: number;
}

const ChatEdit: React.FC<ChatEditProps> = ({ message, isUser, id }) => {
  const [onEdit, setOnEdit] = useState(false);
  const [text, setText] = useState(message.context);
  const { socket } = useContext(Context) as ContextType;
  const [, update] = useUpdateMessageMutation();
  const [, deleteMessage] = useDeleteMessageMutation();

  function keyPress(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      // e.preventDefault();
      setOnEdit(false);
      update({ id: message.id, context: text });
      socket.emit("chatbox", id, {
        message: { ...message, context: text },
        type: "update",
      });
    }
  }

  return (
    <div className={style.context}>
      {message.type === "image" ? (
        <img src={message.context} alt="" />
      ) : !onEdit ? (
        <div className={style.text}>{message.context}</div>
      ) : (
        <form className={style.form}>
          <textarea
            value={text}
            onKeyPress={keyPress}
            rows={3}
            onChange={({ target: { value } }) => setText(value)}
          />
        </form>
      )}

      {/* <div className={style.util}>
        <div className={style.util_wrap}>
          <div className={style.icon_container}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-star-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          </div>
          <div className={style.icon_container}>
            {isUser ? (
              onEdit ? (
                <svg
                  onClick={() => {
                    setOnEdit(false);
                    deleteMessage({ id: message.id });
                    socket.emit("chatbox", id, {
                      message,
                      type: "delete",
                    });
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                </svg>
              ) : (
                <svg
                  onClick={() => setOnEdit(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              )
            ) : null}
          </div>
        </div>
      </div>
     */}
    </div>
  );
};

const ChatBox: React.FC<ChatBoxProps> = ({
  user: { id, fullname, avatar },
  room,
}) => {
  const { setChats, socket, chatContext } = useContext(Context) as ContextType;
  const chatContainer = useRef<any>();
  const [text, setText] = useState("");
  //   const [chatArr, setChatArr] = useState<TranscriptFragmentFragment[]>([]);
  const [myInfo] = useMeQuery();
  const [{ data, fetching }] = useMessagesQuery({
    variables: {
      room,
    },
  });
  const [messages, setMessages] = useState<MessageFragmentFragment[]>([]);
  const [, chat] = useChatMutation();

  const onChating = async () => {
    if (text !== "") {
      console.log(text);
      const message = await chat({
        options: {
          context: text,
          room,
          type: "text",
          userId: myInfo.data?.me?.id,
        },
      });
      setMessages([...messages, message.data?.chat]);

      socket.emit("chatbox", id, { message: message.data?.chat, type: "chat" });
      chatContainer.current.scrollIntoView({ behavior: "smooth" });
      setText("");
    }
  };

  useEffect(() => {
    try {
      console.log(chatContext, room);
      if (chatContext?.message?.room === room) {
        setMessages((messages) => {
          if (chatContext.type === "delete")
            return messages.filter(({ id }) => id !== chatContext?.message?.id);
          else if (chatContext.type === "chat") {
            if (chatContainer?.current) {
              chatContainer.current.scrollIntoView({ behavior: "smooth" });
            }
            return [...messages, chatContext.message];
          } else if (chatContext.type === "update") {
            return messages.map((message) => {
              if (message.id === chatContext?.message?.id)
                return chatContext?.message;
              return message;
            });
          }
        });
      }
    } catch (err) {}
  }, [
    chatContext?.message?.id,
    chatContext?.type,
    chatContext?.message?.context,
  ]);

  useEffect(() => {
    if (data?.messages) {
      setMessages(
        data?.messages.sort((a, b) => {
          return (
            new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
          );
        })
      );
      chatContainer.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.messages]);

  if (fetching || !data?.messages) return null;

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.avatar}>
          <img src={avatar} alt="" />
        </div>
        <div className={style.name}>{fullname}</div>
        <div
          className={style.close}
          onClick={() =>
            setChats((chats) => {
              return chats.filter(({ user }) => {
                return user.id !== id;
              });
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
      </div>
      <div ref={chatContainer} className={style.content}>
        <ul className={style.chat_container}>
          {messages.map((message, index) => {
            return (
              <li
                key={index}
                className={
                  style.chat +
                  " " +
                  (message.userId !== myInfo.data?.me?.id
                    ? style.left_chat
                    : style.right_chat)
                }
              >
                <div className={style.content}>
                  {message.userId !== myInfo.data?.me?.id ? (
                    <div className={style.user}>
                      <img className={style.avatar} src={avatar} alt="" />
                    </div>
                  ) : null}

                  <div className={style.wrap}>
                    {message.userId !== myInfo.data?.me?.id ? (
                      <div className={style.username}>{fullname}</div>
                    ) : (
                      <div className={style.your_username}>{"Bạn"}</div>
                    )}
                    <div
                      className={style.time}
                      style={{
                        justifyContent:
                          message.userId !== myInfo.data?.me?.id
                            ? "flex-start"
                            : "flex-end",
                      }}
                    >
                      {new Date(message.createdAt).getHours() +
                        "g" +
                        new Date(message.createdAt).getMinutes() +
                        "p"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        fill="currentColor"
                        className="bi bi-stopwatch"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z" />
                        <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z" />
                      </svg>
                    </div>

                    <ChatEdit
                      message={message}
                      id={id}
                      isUser={message.userId === myInfo.data?.me?.id}
                    />
                  </div>
                </div>

                {/* <div className={style.time}>
                  <p style={{ marginLeft: username ? "7rem" : null }}>
                    {"01:30"} -{" "}
                    {`${time.getHours()}h${time.getMinutes()}m${time.getSeconds()}s`}{" "}
                  </p>
                  {username === "dat" ? <TickIcon /> : null}
                </div> */}
              </li>
            );
          })}
        </ul>
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => {
            chatContainer.current = el;
          }}
        ></div>
      </div>
      <div className={style.chat_form}>
        <div className={style.chat_form_wrap}>
          <div
            className={style.icon_container}
            onClick={() => {
              //       setOnFiles(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-file-earmark-image-fill"
              viewBox="0 0 16 16"
            >
              <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
              <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z" />
            </svg>
          </div>

          <div className={style.input}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onChating();
              }}
            >
              <textarea
                rows={1}
                // type="text"
                name="text"
                // onKeyDown={(value) => {
                //   if (value.key === "Enter" && !value.shiftKey) {
                //     onChating();
                //   }
                // }}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                }}
                placeholder="Viết tin nhắn"
              />
            </form>
          </div>
          <div onClick={() => onChating()} className={style.icon_container}>
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
