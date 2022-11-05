import React, { useEffect, useRef, useState } from "react";
import style from "../../styles/module/chat.module.scss";

import ImageIcon from "../../../public/icon/image.svg";
import DocumentIcon from "../../../public/icon/document.svg";
import SendIcon from "../../../public/icon/paper-plane.svg";
import HappyIcon from "../../../public/icon/happy.svg";
import FileIcon from "../../../public/icon/file_v1.svg";
import MicroIcon from "../../../public/icon/mic.svg";
import VoiceIcon from "../../../public/icon/voice.svg";

import lottie from "lottie-web";
import { ChatInfoProps, UserProps } from "../../pages/meet/[id]";

interface ChatProps {
  socket: any;
  me: UserProps;
  chats: ChatInfoProps[];
  chatContainer: React.MutableRefObject<any>;
  members: UserProps[];
  setOnFiles: React.Dispatch<React.SetStateAction<boolean>>;
  meetingStartedTime?: Date;
  stateChat: boolean;
  setStateChat: React.Dispatch<React.SetStateAction<boolean>>;
  flagSpeech: boolean;
  speechCallBack: any;
}

const ChatEdit: React.FC<{
  id: number;
  type: string;
  content: string;
  isUser: boolean;
  socket: any;
}> = ({ id, type, content, isUser, socket }) => {
  const [onEdit, setOnEdit] = useState(false);
  const [text, setText] = useState(content);

  useEffect(() => {
    setText(content);
  }, [content]);

  function keyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      // e.preventDefault();
      setOnEdit(false);
      socket.emit("chat edit", id, text);
    }
  }

  return (
    <div className={style.context}>
      {type === "image" ? (
        <img src={content} alt="" />
      ) : type === "application" ? (
        <div className={style.text}>
          <div className={style.file_icon}>
            <FileIcon />
          </div>
          <p>{content}</p>
        </div>
      ) : type === "voice" ? (
        <>
          {!onEdit ? (
            <div className={style.text}>
              <div className={style.file_icon}>
                <VoiceIcon />
              </div>
              <p>{content}</p>
            </div>
          ) : (
            <form
              className={style.form}
              onSubmit={() => {
                setOnEdit(false);
                socket.emit("chat edit", id, text);
              }}
            >
              <textarea
                rows={3}
                value={text}
                onKeyPress={keyPress}
                onChange={({ target: { value } }) => setText(value)}
              />
            </form>
          )}
        </>
      ) : !onEdit ? (
        <div className={style.text}>{content}</div>
      ) : (
        <form
          className={style.form}
          onSubmit={() => {
            setOnEdit(false);
            socket.emit("chat edit", id, text);
          }}
        >
          <textarea
            value={text}
            onKeyPress={keyPress}
            rows={3}
            onChange={({ target: { value } }) => setText(value)}
          />
        </form>
      )}

      <div className={style.util}>
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
                    socket.emit("delete chat", id);
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
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({
  me,
  chats,
  socket,
  chatContainer,
  members,
  setOnFiles,
  meetingStartedTime,
  stateChat,
  setStateChat,
  flagSpeech,
  speechCallBack,
}) => {
  const [time, setTime] = useState<number>(0);
  const voiceLottie = useRef<any>(null);
  const [text, setText] = useState("");

  const getTimeRender = (input: number) => {
    let time = input / 1000;
    let hours = Math.floor(time / (60 * 60));

    let divisor_for_minutes = time % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    // setTimeout(() => setTime(time + 1), 1000);

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  useEffect(() => {
    lottie.loadAnimation({
      container: voiceLottie.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/voice.json"),
    });
  }, []);

  const onChating = () => {
    let chatText = text;
    if (chatText !== "") {
      const chat = {
        username: me.fullname,
        avatar: me.avatar,
        type: "text",
        content: chatText,
        time: new Date(),
        userId: me.id,
        color: me.color,
      };

      socket.emit("chat", chat);

      setText("");
    }
  };

  return (
    <div className={style.container}>
      <div ref={chatContainer} className={style.content}>
        <ul className={style.chat_container}>
          {!flagSpeech ? (
            <>
              <div
                className={style.speech_to_text}
                onClick={() => {
                  speechCallBack();
                }}
              >
                Speech To Text
              </div>
              <div className={style.border}></div>
            </>
          ) : null}
          {chats.map(
            (
              { avatar, content, time, username, type, userId, color },
              index
            ) => {
              return (
                <li
                  key={index}
                  className={
                    style.chat +
                    " " +
                    (username !== me.fullname
                      ? style.left_chat
                      : style.right_chat)
                  }
                >
                  <div className={style.content}>
                    {username !== me.fullname ? (
                      <div className={style.user}>
                        {avatar !== "" ? (
                          <img className={style.avatar} src={avatar} alt="" />
                        ) : (
                          <div
                            className={style.user_not_login_avatar}
                            style={{
                              backgroundColor: color,
                            }}
                          >
                            {username.split(" ").length > 1
                              ? username.split(" ")[0][0] +
                                username.split(" ")[1][0]
                              : username.split(" ")[0][0]}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className={style.wrap}>
                      {username !== me.fullname ? (
                        <div className={style.username}>
                          {username} {type === "voice" ? <MicroIcon /> : null}
                        </div>
                      ) : (
                        <div className={style.your_username}>
                          {"Bạn"} {type === "voice" ? <MicroIcon /> : null}
                        </div>
                      )}
                      <div
                        className={style.time}
                        style={{
                          justifyContent:
                            username !== me.fullname
                              ? "flex-start"
                              : "flex-end",
                        }}
                      >
                        {getTimeRender(
                          new Date(time.valueOf()).valueOf() -
                            meetingStartedTime.valueOf()
                        )}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-stopwatch"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z" />
                          <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z" />
                        </svg>
                      </div>

                      <ChatEdit
                        id={index}
                        socket={socket}
                        type={type}
                        content={content}
                        isUser={username === me.fullname}
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
            }
          )}
        </ul>
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => {
            chatContainer.current = el;
          }}
        ></div>
      </div>
      <div className={style.chat_form}>
        <div className={style.chat_to}>
          <p>To:</p>
          <div className={style.chat_to_btn}>Everyone</div>
          <p style={{ marginLeft: "2rem" }}>Dạng</p>
          <div
            className={style.chat_to_btn}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setStateChat(!stateChat);
            }}
          >
            {stateChat ? "Bình thường" : "Chỉnh sửa"}
          </div>
          <div className={style.voice_container}>
            <div className={style.voice_container_icon}>
              <MicroIcon />
            </div>
            <div ref={voiceLottie} className={style.voice}></div>
          </div>
        </div>
        <div className={style.chat_form_wrap}>
          <div
            className={style.icon_container}
            onClick={() => {
              setOnFiles(true);
            }}
          >
            <ImageIcon />
          </div>
          <div
            className={style.icon_container}
            onClick={() => {
              setOnFiles(true);
            }}
          >
            <DocumentIcon />
          </div>

          <div className={style.input}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onChating();
              }}
            >
              <textarea
                rows={text.length <= 47 ? 1 : 2}
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

            <div className={style.icon_container}>
              <HappyIcon />
            </div>
          </div>
          <div onClick={() => onChating()} className={style.icon_container}>
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
