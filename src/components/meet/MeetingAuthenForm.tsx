import React, { useContext, useEffect, useState } from "react";

import style from "../../styles/module/meet_form.module.scss";

import {
  useCreateMeetingMutation,
  useMeQuery,
  UserFragmentFragment,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { UserProps } from "../../pages/meet/[id]";
import { randomColor } from "../../utils/randomColor";
import { random } from "lodash";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

interface MeetingAuthenFormProps {
  me: UserProps;
  setMe: React.Dispatch<React.SetStateAction<UserProps>>;
  setIsPassword: React.Dispatch<React.SetStateAction<string>>;
  isPassword: string;
  socket: any;
}

const MeetingAuthenForm: React.FC<MeetingAuthenFormProps> = ({
  me,
  setMe,
  setIsPassword,
  socket,
  isPassword,
}) => {
  const { isMeetingAuth } = useContext(Context) as ContextType;
  const roomID = useRouter().query;
  const [text, setText] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [hiddenPassword, setHiddenPassword] = React.useState<string>("");

  const [{ data }] = useMeQuery();

  const [error, setError] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    socket.on("send back room password", ({ isNew, password }) => {
      setHiddenPassword(password);
      if (isNew || isMeetingAuth) {
        socket.emit(
          "room password authenticate",
          password,
          roomID.id,
          isMeetingAuth
        );
      }
    });

    socket.on("room success authenticate", (password: string) => {
      setIsPassword(password);
    });

    socket.on("room error authenticate", (password: string) => {
      setHiddenPassword(password);

      setError((error) => ({
        ...error,
        password: "*Mật khẩu không đúng*",
      }));
    });
  }, []);

  useEffect(() => {
    if (me?.fullname) {
      setText(me?.fullname);
    }
  }, [me?.fullname]);

  if (hiddenPassword === "")
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem",
        }}
      >
        Waiting...
      </div>
    );

  return (
    <div className={style.container} style={{ paddingBottom: "2rem" }}>
      {data?.me ? (
        <img className={style.avatar} src={data.me.avatar} alt="" />
      ) : (
        <div style={{ width: "1.5rem", height: "2rem" }}></div>
      )}

      <div className={style.content}>
        <input
          id="room-input-username"
          style={{ fontWeight: 700 }}
          className={style.input}
          placeholder="Tên người dùng"
          value={text}
          disabled={me ? true : false}
          onChange={({ target }: any) => setText(target.value)}
        />

        {error.username !== "" ? (
          <div
            style={{
              color: "#ff0000",
              marginLeft: ".5rem",
              marginBottom: "1rem",
            }}
          >
            {error.username}
          </div>
        ) : null}

        <input
          id="room-input-password"
          style={{ fontWeight: 700 }}
          className={style.input}
          placeholder="Password"
          type={isPassword === hiddenPassword ? "text" : "password"}
          value={isPassword === hiddenPassword ? hiddenPassword : password}
          onChange={({ target }: any) => setPassword(target.value)}
          disabled={isPassword === hiddenPassword ? true : false}
        />

        {error.password !== "" ? (
          <div
            style={{
              color: "#ff0000",
              marginLeft: ".5rem",
              marginBottom: "1rem",
            }}
          >
            {error.password}
          </div>
        ) : null}

        <div className={style.list_btn}>
          <div className={style.btn_setting} style={{ width: "25rem" }}>
            Nếu bạn muốn lưu trữ biên bản họp hay mời bạn bè vào cuộc họp, bạn
            nên đăng nhập vào ứng dụng
          </div>

          <div
            id="room-join-btn"
            className={style.btn}
            style={{
              width: "6rem",
              textAlign: "center",
              fontSize: "1.2rem",
              bottom: "-.5rem",
            }}
            onClick={() => {
              if (!isPassword && me) {
                socket.emit(
                  "room password authenticate",
                  password,
                  roomID.id,
                  isMeetingAuth
                );
              } else if (!isPassword && !me && text.trim().length > 1) {
                setMe({
                  id: -1,
                  avatar: "",
                  color: randomColor(),
                  banner: "",
                  email: "",
                  fullname: text.trim(),
                  username: "",
                  createdAt: "",
                  cancel: 0,
                  document: 0,
                  joined: 0,
                  timeSpend: 0,
                });
                socket.emit(
                  "room password authenticate",
                  password,
                  roomID.id,
                  isMeetingAuth
                );
              } else if (isPassword && !me && text.trim().length > 1) {
                setMe({
                  id: -1,
                  avatar: "",
                  color: randomColor(),
                  banner: "",
                  email: "",
                  fullname: text.trim(),
                  username: "",
                  createdAt: "",
                  cancel: 0,
                  document: 0,
                  joined: 0,
                  timeSpend: 0,
                });
              } else {
                if (text.trim().length < 2) {
                  setError((error) => ({
                    ...error,
                    username: "*Tên người dùng phải trên 2 ký tự*",
                  }));
                }
              }
            }}
          >
            Đặt
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingAuthenForm;
