import React from "react";
import { Socket } from "socket.io-client";
import {
  NotificationFragmentFragment,
  ScheduleFragmentFragment,
  UserFragmentFragment,
  UserInfoFragmentFragment,
} from "../generated/graphql";
import { ChatProps, MeetingTypeProps, UserChat } from "../pages/_app";

export const dayOfTheWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
export const date_highlight_color = [
  "#37B9E2",
  "#7656D6",
  "#FF7A2E",
  "#2C71FF",
];

export const month = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export type ContextType = {
  socket: Socket;
  todayMeeting: number;
  setTodayMeeting: React.Dispatch<React.SetStateAction<number>>;
  onMeeting: MeetingTypeProps;
  setOnMeeting: React.Dispatch<React.SetStateAction<MeetingTypeProps>>;
  notifications: NotificationFragmentFragment[];
  schedules: ScheduleFragmentFragment[];
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationFragmentFragment[]>
  >;
  setSchedules: React.Dispatch<
    React.SetStateAction<ScheduleFragmentFragment[]>
  >;
  relationships: UserInfoFragmentFragment[];
  setRelationships: React.Dispatch<
    React.SetStateAction<UserInfoFragmentFragment[]>
  >;
  todayMeetingNotJoin: number;
  setTodayMeetingNotJoin: React.Dispatch<React.SetStateAction<number>>;
  chats: UserChat[];
  setChats: React.Dispatch<React.SetStateAction<UserChat[]>>;
  chatContext: ChatProps;
  setChatContext: React.Dispatch<React.SetStateAction<ChatProps>>;
  isMeetingAuth: boolean;
  setIsMeetingAuth: React.Dispatch<React.SetStateAction<boolean>>;
};
