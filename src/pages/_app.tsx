import React, { useEffect, useState } from "react";
import "../styles/main.scss";
import socketIOClient, { Socket } from "socket.io-client";
import {
  MessageFragmentFragment,
  NotificationFragmentFragment,
  RelationshipsQuery,
  ScheduleFragmentFragment,
  TranscriptFragmentFragment,
  useGetSchedulesQuery,
  useMeQuery,
  useNotificationsQuery,
  useRelationshipsQuery,
  UserFragmentFragment,
  UserInfoFragmentFragment,
} from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ENDPOINT = process.env.NEXT_PUBLIC_SIGNALING_SERVER as string;
//@ts-ignore
const socket: Socket = socketIOClient(ENDPOINT, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "share",
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

export const Context = React.createContext(null);

export interface MeetingTypeProps {
  user?: UserFragmentFragment;
  url: string;
  content: string;
}

export interface UserChat {
  room: string;
  user: UserFragmentFragment;
}

export interface ChatProps {
  message?: MessageFragmentFragment;
  type: string;
}

function MyApp({ Component, pageProps }: any) {
  const [{ data }] = useMeQuery();
  const [isMeetingAuth, setIsMeetingAuth] = useState(false);
  const [todayMeeting, setTodayMeeting] = useState(0);
  const [todayMeetingNotJoin, setTodayMeetingNotJoin] = useState(0);
  const [notifications, setNotifications] = useState<
    NotificationFragmentFragment[]
  >([]);
  const [schedules, setSchedules] = useState<ScheduleFragmentFragment[]>([]);
  const [onMeeting, setOnMeeting] = useState<MeetingTypeProps>(undefined);
  const [relationships, setRelationships] = useState<
    UserInfoFragmentFragment[]
  >([]);
  const [chats, setChats] = useState<UserChat[]>([]);
  const [chatContext, setChatContext] = useState<ChatProps>();

  const [mySchedules] = useGetSchedulesQuery();
  const [myNotifcations] = useNotificationsQuery();
  const [myRelationships] = useRelationshipsQuery({
    variables: { id: data?.me?.id },
  });

  useEffect(() => {
    if (data?.me?.id) {
      socket.emit("login user", data.me.id);
      socket.on("receive notification", (notification: any) => {
        setNotifications((notis) => [notification, ...notis]);
        const audio = new Audio("audio/persona_5.mp3");
        audio.play();
        // audio.currentTime = 0;
      });
      socket.on("receive schedule", (schedule: ScheduleFragmentFragment) => {
        setSchedules((schedules) => [schedule, ...schedules]);
      });
      socket.on(
        "receive relationship",
        (relationship: UserInfoFragmentFragment) => {
          setRelationships((relationships) => [relationship, ...relationships]);
        }
      );
      socket.on("on update schedule", (schedule: ScheduleFragmentFragment) => {
        setSchedules((schedules) =>
          schedules.map((value) => {
            if (value.id === schedule.id) return schedule;
            return value;
          })
        );
      });
      socket.on("on delete schedule", (scheduleId: number) => {
        setSchedules((schedules) =>
          schedules.filter(({ id }) => id !== scheduleId)
        );
      });
      socket.on("notify your meeting started", (meeting: MeetingTypeProps) => {
        setOnMeeting(meeting);
      });
      socket.on("receive chatbox", (data: ChatProps) => {
        setChatContext(data);
      });
    }

    return () => {
      // if (data?.me?.id) {
      socket.emit("user out", data?.me?.id);
      //   socket.disconnect();
      // }
    };
  }, [data?.me?.id]);

  useEffect(() => {
    if (data?.me?.id) {
      if (mySchedules?.data?.getSchedules) {
        setSchedules(mySchedules?.data?.getSchedules);
      }
      if (myNotifcations?.data?.notifications) {
        setNotifications(myNotifcations?.data?.notifications);
      }
      if (myRelationships?.data?.relationships) {
        setRelationships(myRelationships?.data?.relationships);
      }
    }
  }, [data?.me?.id]);

  return (
    <Context.Provider
      value={{
        chats,
        setChats,
        socket,
        todayMeeting,
        setTodayMeeting,
        onMeeting,
        setOnMeeting,
        notifications,
        setNotifications,
        schedules,
        setSchedules,
        relationships,
        setRelationships,
        todayMeetingNotJoin,
        setTodayMeetingNotJoin,
        chatContext,
        setChatContext,
        isMeetingAuth,
        setIsMeetingAuth,
      }}
    >
      <Component {...pageProps} />
    </Context.Provider>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(MyApp);
