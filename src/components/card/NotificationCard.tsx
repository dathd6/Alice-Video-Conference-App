import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useSeenNotificationMutation } from "../../generated/graphql";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

interface NotificationCardProps {
  fullname: string;
  avatar: string;
  content: string;
  url: string;
  isSeen?: boolean;
  createdAt: string;
  id: number;
  type: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  avatar,
  content,
  fullname,
  url,
  isSeen,
  createdAt,
  type,
}) => {
  const router = useRouter();
  const { setNotifications } = useContext(Context) as ContextType;
  const [, seen] = useSeenNotificationMutation();

  const dateRender = (createdAt: string) => {
    const createdTime = new Date(createdAt);
    const thisTime = new Date();

    const time = (thisTime.valueOf() - createdTime.valueOf()) / 1000;
    if (time < 60) return "Mới đây";
    else if (time < 60 * 60) {
      return `${Math.floor(time / 60)} phút trước`;
    } else if (time < 60 * 60 * 24) {
      return `${Math.floor(time / 3600)} giờ trước`;
    } else if (time < 60 * 60 * 24 * 7) {
      return `${Math.floor(time / (3600 * 24))} ngày trước`;
    } else if (time < 60 * 60 * 24 * 7 * 4) {
      return `${Math.floor(time / (3600 * 24 * 7))} tuần trước`;
    } else if (time < 60 * 60 * 24 * 7 * 4 * 12) {
      return `${Math.floor(time / (3600 * 24 * 7 * 4))} tháng trước`;
    } else {
      return `${Math.floor(time / (3600 * 24 * 7 * 4 * 12))} năm trước`;
    }
  };

  return (
    <Container
      onClick={() => {
        // router.reload();
        if (!isSeen && type !== "document") {
          seen({ id });
          setNotifications((notifications) =>
            notifications.map((noti) => {
              if (noti.id === id) return { ...noti, isSeen: true };
              else return noti;
            })
          );
        }
        // if (type === "schedule") router.push("/schedule");
        // else router.push(url);
      }}
    >
      <Avatar>
        <img src={avatar} alt="" />
      </Avatar>
      <Content>
        <Name>
          <p style={{ marginRight: "1rem" }}>
            {fullname}
            {content.includes("thêm bạn vào lịch họp mới") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="orange"
                className="bi bi-calendar-plus-fill"
                viewBox="0 0 16 16"
              >
                <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM8.5 8.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5a.5.5 0 0 1 1 0z" />
              </svg>
            ) : content.includes("chấp nhận lời mời kết bạn") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#1da1f2"
                className="bi bi-person-check-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                />
                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
            ) : content.includes("đã bắt đầu cuộc họp") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#A52A2A"
                className="bi bi-calendar3-week-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2 0a2 2 0 0 0-2 2h16a2 2 0 0 0-2-2H2zM0 14V3h16v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm12-8a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM5 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm5-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM2 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"
                />
              </svg>
            ) : content.includes("gửi lời mời kết bạn") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="green"
                className="bi bi-person-plus-fill"
                viewBox="0 0 16 16"
              >
                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path
                  fillRule="evenodd"
                  d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                />
              </svg>
            ) : content.includes("tạo biên bản") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#8A2BE2"
                className="bi bi-file-earmark-post-fill"
                viewBox="0 0 16 16"
              >
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-5-.5H7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1 0-1zm0 3h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z" />
              </svg>
            ) : content.includes("đã xóa lịch họp") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="red"
                className="bi bi-calendar-x"
                viewBox="0 0 16 16"
              >
                <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
              </svg>
            ) : content.includes("buộc bạn ra khỏi lịch") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#FF1493"
                className="bi bi-calendar-x-fill"
                viewBox="0 0 16 16"
              >
                <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM6.854 8.146 8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 1 1 .708-.708z" />
              </svg>
            ) : content.includes("vừa chỉnh sửa lịch họp") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#FFD700"
                className="bi bi-calendar-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
              </svg>
            ) : content.includes("mời bạn tham gia") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#a71f63"
                className="bi bi-camera-video-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"
                />
              </svg>
            ) : null}
            <span style={{ color: "#6d6d6d" }}>{content}</span>
          </p>
        </Name>
        <Time>{dateRender(createdAt)}</Time>
      </Content>
      {!isSeen ? <New></New> : null}
    </Container>
  );
};

export default NotificationCard;

const Time = styled.div`
  font-size: 1.4rem;
  color: #6d6d6d;
`;

const New = styled.div`
  position: absolute;
  color: #fff;
  background-color: #1da1f2;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 100%;
  right: 1.2rem;
  top: 2.2rem;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;

  border-bottom: solid 0.1rem #ebeef0;
  padding: 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: #05050524;
  }
`;

const Avatar = styled.div`
  width: 4rem;
  height: 4rem;

  img {
    width: 4rem;
    height: 4rem;
    border-radius: 100%;
  }
  margin-right: 1rem;
`;

const Content = styled.div`
  width: 80%;
`;

const Name = styled.div`
  align-items: center;
  display: flex;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;

  svg {
    margin: auto 1rem;
  }
`;

const Noti = styled.div`
  font-size: 1.2rem;
`;
