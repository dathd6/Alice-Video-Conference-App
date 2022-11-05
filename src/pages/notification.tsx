import React, { useContext, useEffect, useState } from "react";

// Layout
import Layout from "../layout/Layout";
import { useIsAuth } from "../utils/useIsAuth";
import Header from "../components/header/Header";

import Top from "../../public/icon/notification.svg";
import NotificationCard from "../components/card/NotificationCard";
import { Context } from "./_app";
import { ContextType } from "../static/types";
import Empty from "../components/card/Empty";
import Link from "next/link";

interface NotificationProps {}

const Notification: React.FC<NotificationProps> = ({}) => {
  const { socket, notifications, setNotifications } = useContext(
    Context
  ) as ContextType;

  if (!useIsAuth()) {
    return null;
  }

  return (
    <Layout>
      <Header title={"Thông báo"} icon={<Top />} />

      {/* <UpcomingMeeting /> */}
      {!notifications || notifications.length === 0 ? (
        <Empty />
      ) : (
        <>
          {notifications
            .sort((a, b) => b.id - a.id)
            .map(
              ({ id, url, content, user, createdAt, isSeen, type }, index) => {
                return (
                  <Link
                    key={index}
                    href={type === "schedule" ? "/schedule" : url}
                  >
                    <a>
                      <NotificationCard
                        id={id}
                        isSeen={isSeen}
                        fullname={user.fullname}
                        avatar={user.avatar}
                        content={content}
                        url={url}
                        createdAt={createdAt}
                        type={type}
                      />
                    </a>
                  </Link>
                );
              }
            )}
          <div style={{ height: "calc(100vh - 11.5rem)", width: "100%" }}></div>
        </>
      )}
    </Layout>
  );
};

export default Notification;
