import React, { useContext } from "react";
import style from "../../styles/module/card.module.scss";

import styled from "styled-components";

import MessageIcon from "../../../public/icon/message_meet.svg";
import UserIcon from "../../../public/icon/user_meet.svg";
import StartIcon from "../../../public/icon/start.svg";
import ClockIcon from "../../../public/icon/clock.svg";
import MoreIcon from "../../../public/icon/more.svg";
import { list_banner } from "../schedule/ScheduleForm";
import {
  ScheduleFragmentFragment,
  useCreateNotificationMutation,
  useGetUserFromScheduleQuery,
  useMeQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

interface HostProps {
  avatar: string;
  name: string;
  hashtag: string;
}

interface MeetingCardProps {
  // frequency: string;
  // type: string;
  // time: Date;
  // title: string;
  // color: number;
  // members: string[];
  // host: HostProps;
  schedule: ScheduleFragmentFragment;
  isSeen?: boolean;
  isUpcoming?: boolean;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleFragmentFragment>>;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  schedule,
  isSeen,
  isUpcoming,
  setSchedule,
}) => {
  const numberToString = (number: number) => {
    if (number < 10) return "0" + number.toString();
    return number;
  };

  const { socket, setIsMeetingAuth } = useContext(Context) as ContextType;

  const router = useRouter();
  const [, createNotification] = useCreateNotificationMutation();

  const [users] = useGetUserFromScheduleQuery({
    variables: {
      scheduleId: schedule?.id,
    },
  });
  const [myInfo] = useMeQuery();

  const getTime = (date: Date) => {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let isAM = true;
    if (hour >= 13) {
      hour = hour - 12;
      isAM = false;
    }
    return `${numberToString(hour)}:${numberToString(minute)} ${
      isAM ? "AM" : "PM"
    }`;
  };

  return (
    <div
      className={style.container}
      style={{
        backgroundImage: `url(${schedule?.banner})`,
      }}
    >
      {isSeen === false ? (
        <div className={style.new}>
          <img src="icon/new.png" alt="" />
        </div>
      ) : isUpcoming ? (
        <div style={{ top: "-5rem", left: "-4rem" }} className={style.new}>
          <img
            style={{
              width: "8rem",
              height: "8rem",
            }}
            src="icon/upcoming.png"
            alt=""
          />
        </div>
      ) : null}
      <div className={style.more}>
        <MoreIcon />
      </div>
      <img className={style.avatar} src={schedule?.host?.avatar} alt="" />
      <div className={style.content}>
        <div className={style.header}>
          <div className={style.host}>
            <div className={style.host_info}>
              <div className={style.host_info_name}>
                {schedule?.host?.fullname}
              </div>

              <div className={style.frequency}>
                <span>{"@" + schedule?.host?.username} </span>
                {/* {schedule?.startAt + " - " + schedule?.dateType} */}
              </div>
            </div>
          </div>
        </div>
        <div className={style.content_title}>{schedule?.title}</div>
        <div className={style.content_info + " hidden_value"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-building"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
            />
            <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
          </svg>
          <span>
            {schedule?.company !== "" ? <>{schedule?.company} </> : "Chưa có"}
          </span>
        </div>
        <div className={style.content_info + " hidden_value"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-info-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
          <span>
            {schedule?.description !== "" ? schedule?.description : "Chưa có"}
          </span>
        </div>
        <ul className={style.list_icon}>
          <Icon
            color={"#6bb082"}
            //@ts-ignore
            background={"#e2f6e9"}
            className={style.icon}
          >
            <div className={"icon_meeting " + style.icon_image}>
              <ClockIcon />
            </div>
            <div className={style.icon_data}>
              {schedule?.startAt.split(":")[0] +
                "h" +
                schedule?.startAt.split(":")[1] +
                "m"}
            </div>
          </Icon>
          {myInfo?.data?.me?.id === schedule?.host?.id &&
          users?.data?.getUserFromSchedule ? (
            <>
              <Icon
                color={"#5f4aba"}
                //@ts-ignore
                background={"#d9d3ff"}
                className={style.icon}
                onClick={() => {
                  setSchedule(schedule);
                }}
              >
                <div className={"icon_meeting " + style.icon_image}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                  </svg>
                </div>
                <div className={style.icon_data}>Chỉnh sửa</div>
              </Icon>
              <Icon
                color={"#fc5930"}
                //@ts-ignore
                background={"#fff0e9"}
                className={style.icon}
                onClick={() => {
                  const date = new Date();

                  setIsMeetingAuth(true);

                  const url = `/meet/${
                    schedule?.id +
                    schedule?.startAt +
                    date.toString().replaceAll(" ", "")
                  }?scheduleId=${schedule?.id}&time=${
                    date.getHours() +
                    ":" +
                    date.getMinutes() +
                    ":" +
                    date.getSeconds()
                  }`;
                  users?.data?.getUserFromSchedule.map(async ({ id }) => {
                    if (id !== myInfo?.data?.me?.id) {
                      const notification = await createNotification({
                        content: `đã bắt đầu cuộc họp "${schedule?.title}"`,
                        url,
                        receiver: id,
                        type: "start meeting",
                        isSeen: false,
                      });
                      socket.emit(
                        "send notification",
                        notification?.data?.createNotification
                      );
                      socket.emit("notify member to join", id, {
                        content: `đã bắt đầu cuộc họp "${schedule?.title}" mời các thành viên vào họp`,
                        user: myInfo?.data?.me,
                        url,
                      });
                    }
                  });

                  router.push(url);
                }}
              >
                <div className={"icon_meeting " + style.icon_image}>
                  <StartIcon />
                </div>
                <div className={style.icon_data}>Tham gia</div>
              </Icon>
            </>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default MeetingCard;

const Icon = styled.li`
  cursor: pointer;
  &:hover {
    div {
      color: ${(props: any) => props.color};
    }
    .icon_meeting {
      svg {
        path {
          fill: ${(props: any) => props.color};
        }
      }
      background: ${(props: any) => props.background};
    }
  }
`;
