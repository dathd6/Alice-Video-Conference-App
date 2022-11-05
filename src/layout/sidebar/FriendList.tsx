import React from "react";
import { useContext } from "react";
import { useScrollBoost } from "react-scrollbooster";

import MoreIcon from "../../../public/icon/others.svg";
import { useRelationshipsQuery, useMeQuery } from "../../generated/graphql";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

// Module scss
import style from "../../styles/module/friend.module.scss";

interface FriendProps {}

const Friend: React.FC<FriendProps> = ({}) => {
  const { relationships, setChats } = useContext(Context) as ContextType;
  const [viewport, scrollbooster] = useScrollBoost({
    direction: "all",
    friction: 0.2,
    scrollMode: "native",
    bounce: true,
    // ...optional options
  });
  const [myInfo] = useMeQuery();

  return (
    <div className={style.container}>
      {relationships.filter(({ relationship }) => relationship === "follow")
        .length > 0 ? (
        <>
          <h1 className={style.header}>
            Bạn bè
            <div className={style.header_icon}>
              <MoreIcon />
            </div>
          </h1>
          <ul
            onScroll={(_: any) => {
              if (scrollbooster) {
              }
            }}
            ref={viewport}
            className={style.list}
          >
            {relationships
              .filter(({ relationship }) => relationship === "follow")
              .map(({ user }) => {
                return (
                  <div
                    key={user.id}
                    className={style.friend}
                    onClick={() => {
                      setChats((chats) => {
                        if (chats.find(({ user: { id } }) => id === user.id))
                          return chats;
                        if (chats.length === 3)
                          return [
                            {
                              user,
                              room:
                                myInfo.data?.me?.id > user.id
                                  ? `${user.id}-${myInfo.data?.me?.id}`
                                  : `${myInfo.data?.me?.id}-${user.id}`,
                            },
                            chats[1],
                            chats[2],
                          ];
                        else
                          return [
                            ...chats,
                            {
                              user,
                              room:
                                myInfo.data?.me?.id > user.id
                                  ? `${user.id}-${myInfo.data?.me?.id}`
                                  : `${myInfo.data?.me?.id}-${user.id}`,
                            },
                          ];
                      });
                    }}
                  >
                    <div className={style.avatar}>
                      <img src={user.avatar} alt="" />
                    </div>
                    <div className={style.name}>{user.fullname}</div>
                  </div>
                );
              })}
          </ul>
        </>
      ) : null}
    </div>
  );
};

export default Friend;
