import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useCreateNotificationMutation,
  useMeQuery,
  UserFragmentFragment,
} from "../../generated/graphql";
import { UserProps } from "../../pages/meet/[id]";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";
import style from "../../styles/module/invite.module.scss";
import Empty from "../card/Empty";

interface InviteMemberProps {
  members: UserProps[];
}

interface ItemProps extends UserFragmentFragment {}

const Item: React.FC<ItemProps> = ({ id, username, fullname, avatar }) => {
  const router = useRouter();
  const [state, setState] = useState(false);
  const { socket } = useContext(Context) as ContextType;

  const [, createNotification] = useCreateNotificationMutation();
  const [{ data }] = useMeQuery();

  return (
    <li className={style.item}>
      <div className={style.avatar}>
        <img src={avatar} alt="" />
      </div>
      <div className={style.info}>
        <div className={style.fullname}>{fullname}</div>
        <div className={style.username}>{"@" + username}</div>
      </div>
      {!state ? (
        <div
          onClick={async () => {
            setState(true);
            const url = router.asPath;
            const notification = await createNotification({
              content: `mời bạn tham gia phòng họp có mã "${url}"`,
              url,
              receiver: id,
              type: "invite",
              isSeen: false,
            });
            socket.emit(
              "send notification",
              notification?.data?.createNotification
            );
            socket.emit("notify member to join", id, {
              content: `mời bạn tham gia phòng họp có mã "${url}"`,
              user: data?.me,
              url,
            });
          }}
          className={style.button}
        >
          Mời
        </div>
      ) : (
        <div style={{ backgroundColor: "grey" }} className={style.button}>
          Đợi
        </div>
      )}
    </li>
  );
};

const InviteMember: React.FC<InviteMemberProps> = ({ members }) => {
  const { relationships } = useContext(Context) as ContextType;
  const [text, setText] = useState("");
  return (
    <div className={style.container}>
      <div className={style.search_form}>
        <div className={style.input}>
          <input
            placeholder="Find your member"
            value={text}
            onChange={({ target }: any) => {
              setText(target.value);
            }}
          />
          <span
            onClick={() => {
              if (text !== "") {
                setText("");
              }
            }}
            className={
              text === "" ? style.search : `${style.search} ${style.close}`
            }
          />
        </div>
      </div>
      <ul className={style.list}>
        {relationships.filter(
          ({ relationship, user: { fullname, id } }) =>
            relationship === "follow" &&
            fullname.toLowerCase().includes(text.toLowerCase()) &&
            !members.find((member) => member.id === id)
        ).length === 0 ? (
          <Empty />
        ) : (
          relationships
            .filter(
              ({ relationship, user: { fullname, id } }) =>
                relationship === "follow" &&
                fullname.toLowerCase().includes(text.toLowerCase()) &&
                !members.find((member) => member.id === id)
            )
            .map(({ user }, index) => {
              return <Item {...user} key={index} />;
            })
        )}
      </ul>
    </div>
  );
};

export default InviteMember;
