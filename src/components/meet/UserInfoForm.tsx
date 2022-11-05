import React, { useState } from "react";

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

interface UserInfoFormProps {
  setMe: React.Dispatch<React.SetStateAction<UserProps>>;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ setMe }) => {
  const [text, setText] = React.useState("");

  const [{ data }] = useMeQuery();

  const [error, setError] = useState("");

  return (
    <div className={style.container} style={{ paddingBottom: "2rem" }}>
      {data?.me ? (
        <img className={style.avatar} src={data.me.avatar} alt="" />
      ) : (
        <div style={{ width: "1.5rem", height: "2rem" }}></div>
      )}

      <div className={style.content}>
        <input
          style={{ fontWeight: 700 }}
          className={style.input}
          placeholder="Tên người dùng"
          value={text}
          onChange={({ target }: any) => setText(target.value)}
        />

        {error !== "" ? (
          <div
            style={{
              color: "#ff0000",
              marginLeft: ".5rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        ) : null}

        <div className={style.list_btn}>
          <div className={style.btn_setting} style={{ width: "25rem" }}>
            Nếu bạn muốn lưu trữ biên bản họp hay mời bạn bè vào cuộc họp, bạn
            nên đăng nhập vào ứng dụng
          </div>

          <div
            className={style.btn}
            style={{
              width: "6rem",
              textAlign: "center",
              fontSize: "1.2rem",
              bottom: "-.5rem",
            }}
            onClick={() => {
              if (text.trim().length > 1) {
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
                setError("*Tên người dùng phải trên 2 ký tự*");
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

export default UserInfoForm;
