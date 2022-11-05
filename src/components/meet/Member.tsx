import React, { useEffect, useState } from "react";
import style from "../../styles/module/member.module.scss";

import Mic from "../../../public/icon/mic.svg";
import Mute from "../../../public/icon/mute.svg";

import ChatIcon from "../../../public/icon/message_meet.svg";
import ClipIcon from "../../../public/icon/clip.svg";
import AddUserIcon from "../../../public/icon/invite.svg";
import VoteIcon from "../../../public/icon/vote.svg";
import RemoveIcon from "../../../public/icon/remove_user.svg";
import { useGetScheduleQuery } from "../../generated/graphql";
import { UserProps } from "../../pages/meet/[id]";
import { pathToFileURL } from "node:url";
import { randomColor } from "../../utils/randomColor";

interface MemberProps {
  members: UserProps[];
  hostId: number;
  setInvite: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RenderUtilProps {
  host: boolean;
}

const RenderUtil: React.FC<RenderUtilProps> = ({ host }) => {
  const [isMute, setIsMute] = React.useState(true);
  const [isShare, setIsShare] = React.useState(true);
  return (
    <>
      {host ? (
        <div
          className={style.active}
          style={{ fontWeight: 700, textAlign: "center" }}
        >
          Chủ phòng
        </div>
      ) : null}
      <div className={style.active}>
        <ChatIcon />
      </div>
      <div
        className={isMute ? style.unactive : style.active}
        onClick={() => setIsMute(!isMute)}
      >
        {!isMute ? <Mic /> : <Mute />}
      </div>
      {/* <div
        className={isShare ? style.unactive : style.active}
        onClick={() => setIsShare(!isShare)}
      >
        {!isShare ? <Share /> : <Unshare />}
      </div> */}
    </>
  );
};

const Member: React.FC<MemberProps> = ({ members, hostId, setInvite }) => {
  const [text, setText] = useState("");

  if (!members) return <></>;

  const [search, setSearch] = useState(members);

  useEffect(() => {
    setSearch(members);
  }, [members.length]);

  return (
    <div className={style.container}>
      <div className={style.search_form}>
        <div className={style.input}>
          <input
            placeholder="Find your member"
            value={text}
            onChange={({ target }: any) => {
              setText(target.value);
              setSearch(
                members.filter(({ fullname }) => {
                  if (text === "") return true;
                  return fullname.includes(text);
                })
              );
            }}
          />
          <span
            onClick={() => {
              if (text !== "") {
                setText("");
                setSearch(members);
              }
            }}
            className={
              text === "" ? style.search : `${style.search} ${style.close}`
            }
          />
        </div>
      </div>

      <ul className={style.list}>
        {search.map(({ color, fullname, avatar, username, id }, index) => (
          <li className={style.user} key={index}>
            <div className={style.avatar}>
              {avatar !== "" ? (
                <img src={avatar} alt="" />
              ) : (
                <div
                  className={style.user_not_login_avatar}
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {fullname.split(" ").length > 1
                    ? fullname.split(" ")[0][0] + fullname.split(" ")[1][0]
                    : fullname.split(" ")[0][0]}
                </div>
              )}
            </div>
            <div
              className={style.content}
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <h2 className={style.name}>{fullname}</h2>
              {username ? (
                <p className={style.hashtag}>{"@" + username}</p>
              ) : null}
            </div>
            <div className={style.util}>
              <RenderUtil host={hostId === id} />
            </div>
          </li>
        ))}
      </ul>

      <div className={style.config}>
        <div className={style.config_icon + " " + style.convert}>
          <VoteIcon />
        </div>
        <div className={style.config_wrap}>
          <div className={style.main} onClick={() => setInvite(true)}>
            <AddUserIcon />
          </div>
          <div className={style.remove}>
            <RemoveIcon />
          </div>
        </div>
        <div className={style.main_border}></div>
        <div className={style.config_icon + " " + style.config_clip}>
          <ClipIcon />
        </div>
      </div>
    </div>
  );
};

export default Member;
