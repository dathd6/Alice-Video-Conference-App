import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import style from "../../styles/module/profile.module.scss";
import lottie from "lottie-web";

// Layout
import Layout from "../../layout/Layout";
import Header from "../../components/header/Header";
import Top from "../../../public/icon/star.svg";
import {
  useAcceptMutation,
  useCreateNotificationMutation,
  useFollowMutation,
  useRelationshipsQuery,
  useGetUserByIdQuery,
  useMeQuery,
  useUnfollowMutation,
} from "../../generated/graphql";
import { ContextType, month } from "../../static/types";
import { useRouter } from "next/router";
import { Context } from "../_app";
import Empty from "../../components/card/Empty";
import { useState } from "react";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = ({}) => {
  const router = useRouter();

  const [, follow] = useFollowMutation();
  const [, accept] = useAcceptMutation();
  const [, unfollow] = useUnfollowMutation();
  const [, createNoti] = useCreateNotificationMutation();
  const [{ data }] = useGetUserByIdQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });
  const [myInfo] = useMeQuery();
  const [friends] = useRelationshipsQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });
  const { socket, relationships, setRelationships } = useContext(
    Context
  ) as ContextType;
  const relationshipType = relationships.find(
    ({ id }) => id === parseInt(router.query.id as string)
  )?.relationship;

  if (myInfo?.data?.me?.id === parseInt(router.query.id as string))
    router.push("/profile");
  if (!data?.getUserById) return <div></div>;

  const joinedDateRender = (joined: string) => {
    const date = new Date(joined);
    return month[date.getMonth()] + " " + date.getFullYear();
  };

  return (
    <Layout>
      <Header
        title={
          <Title>
            <Icon onClick={() => router.back()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
            </Icon>
            <Text>{data.getUserById.user.email}</Text>
          </Title>
        }
        icon={<Top />}
      />
      <div className={style.container}>
        <div
          className={style.banner}
          style={{
            background: `url(${data.getUserById.user.banner})`,
          }}
        ></div>
        <div className={style.wrap}>
          <div className={style.avatar}>
            <img src={data.getUserById.user.avatar} alt={""} />
          </div>
          {!relationshipType ? (
            <div
              className={style.button}
              onClick={async () => {
                await follow({
                  sender: myInfo?.data?.me?.id,
                  receiver: parseInt(router.query.id as string),
                });
                const notification = await createNoti({
                  content: `gửi lời mời kết bạn cho bạn`,
                  url: `/profile/${myInfo?.data?.me?.id}`,
                  receiver: parseInt(router.query.id as string),
                  type: "add friend",
                  isSeen: false,
                });
                const relationship = {
                  id: myInfo?.data?.me?.id,
                  user: myInfo?.data?.me,
                  relationship: `${myInfo?.data?.me?.id}`,
                };
                setRelationships((relationships) => [
                  {
                    id: parseInt(router.query.id as string),
                    user: data?.getUserById?.user,
                    relationship: `${myInfo?.data?.me?.id}`,
                  },
                  ...relationships,
                ]);
                socket.emit(
                  "send relationship",
                  parseInt(router.query.id as string),
                  relationship
                );
                socket.emit(
                  "send notification",
                  notification?.data?.createNotification
                );
              }}
            >
              Kết bạn
            </div>
          ) : relationshipType === "follow" ? (
            <div
              className={style.button_followed}
              onClick={() => {
                unfollow({
                  sender: myInfo?.data?.me.id,
                  receiver: parseInt(router.query.id as string),
                });
                setRelationships((relationships) =>
                  relationships.filter(({ id }) => {
                    return id !== parseInt(router.query.id as string);
                  })
                );
              }}
            ></div>
          ) : parseInt(data.getUserById.relationship) ===
            myInfo?.data?.me.id ? (
            <div className={style.button_queue}>Đợi</div>
          ) : (
            <div
              className={style.button_accept}
              onClick={async () => {
                await accept({
                  sender: myInfo?.data?.me.id,
                  receiver: parseInt(router.query.id as string),
                });
                const notification = await createNoti({
                  content: `chấp nhận lời mời kết bạn, bạn giờ là bạn bè`,
                  url: `/profile/${myInfo?.data?.me.id}`,
                  receiver: parseInt(router.query.id as string),
                  type: "accept friend",
                  isSeen: false,
                });
                socket.emit(
                  "send notification",
                  notification?.data?.createNotification
                );
                setRelationships((relationships) => [
                  {
                    id: parseInt(router.query.id as string),
                    user: data?.getUserById?.user,
                    relationship: `follow`,
                  },
                  ...relationships,
                ]);
                socket.emit(
                  "send relationship",
                  parseInt(router.query.id as string),
                  {
                    id: myInfo?.data?.me?.id,
                    user: myInfo?.data?.me,
                    relationship: `follow`,
                  }
                );
              }}
            >
              Chấp nhận
            </div>
          )}

          <div className={style.username}>{data.getUserById.user.fullname}</div>
          <div className={style.hashtag}>
            {"@" + data.getUserById.user.username}
          </div>
          <div className={style.time}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-calendar3"
              viewBox="0 0 16 16"
            >
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
            <span>
              Tham gia {joinedDateRender(data.getUserById.user.createdAt)}
            </span>
          </div>
        </div>
        <div
          style={{
            padding: "1rem 2rem",
            fontSize: "2rem",
            fontWeight: 600,
          }}
        >
          Danh sách bạn bè
        </div>
        <ul className={style.list}>
          {friends?.data?.relationships.length === 0 ? (
            <Empty />
          ) : (
            friends?.data?.relationships.map(
              ({ user: { avatar, fullname, username, id } }, index) => {
                return (
                  <li key={index} className={style.item}>
                    <div className={style.avatar}>
                      <img src={avatar} alt="" />
                    </div>
                    <div className={style.info}>
                      <div className={style.fullname}>{fullname}</div>
                      <div className={style.username}>{"@" + username}</div>
                    </div>
                    <div
                      onClick={() => router.push(`/profile/${id}`)}
                      className={style.button}
                    >
                      Xem trang cá nhân
                    </div>
                  </li>
                );
              }
            )
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default Profile;

const Active = styled.div`
  position: absolute;
  background-color: #fff;
  left: 0;
  top: 0;
  border-radius: 2rem;
  width: 7.8rem;
  height: 100%;
  z-index: -1;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`;

const TimeButton = styled.div`
  padding: 1rem 1.5rem;
  color: ${(props: any) => (props.active ? "#050505" : "#9da9bb")};
  border-radius: 2rem;
  z-index: 1;
`;

const Time = styled.div`
  position: relative;
  display: flex;
  margin-right: 12rem;
  background-color: #f4f6f8;
  border-radius: 2rem;
  padding: 0 1rem;
  z-index: 0;
`;

const Text = styled.div`
  margin-left: 1rem;
  span {
    color: #9da9bb;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  margin-right: 0.5rem;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
