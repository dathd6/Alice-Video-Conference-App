import React, { useContext, useEffect, useRef } from "react";

import style from "../../styles/module/meet_form.module.scss";

import Earth from "../../../public/icon/earth.svg";
import Address from "../../../public/icon/address.svg";

import { ScheduleFragmentFragment, useMeQuery } from "../../generated/graphql";
import { useRouter } from "next/router";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

interface RequestMeetingProps {}

const RequestMeeting: React.FC<RequestMeetingProps> = ({}) => {
  const { onMeeting, setOnMeeting, setIsMeetingAuth } = useContext(
    Context
  ) as ContextType;

  const router = useRouter();

  const onCreateMeeting = () => {
    setOnMeeting(undefined);
    setIsMeetingAuth(true);
    router.push(onMeeting.url);
  };

  useEffect(() => {
    const audio = new Audio("audio/ringtone.mp3");
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [onMeeting]);

  return (
    <div className={style.container}>
      {onMeeting?.user ? (
        <img
          style={{ marginTop: 10 }}
          className={style.avatar}
          src={onMeeting?.user?.avatar}
          alt=""
        />
      ) : null}

      <div className={style.content}>
        <div className={style.input} style={{ paddingBottom: 50 }}>
          {onMeeting?.user ? (
            <p style={{ fontWeight: 700 }}>{onMeeting?.user?.fullname}</p>
          ) : null}
          {onMeeting.content}
        </div>
        <div className={style.list_btn}>
          <div className={style.state}></div>

          <div className={style.btn} onClick={onCreateMeeting}>
            Tham gia
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMeeting;

const list_icon = [
  {
    icon: <Earth />,
    text: "Everyone can join the room",
    subtext: "Everyone",
  },
  {
    icon: <Address />,
    text: "Only people you mention can join",
    subtext: "Specific people",
  },
];
