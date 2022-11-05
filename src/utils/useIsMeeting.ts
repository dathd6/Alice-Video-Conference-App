import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  ScheduleFragmentFragment,
  useCreateMeetingMutation,
  useGetSchedulesQuery,
  useMeQuery,
} from "../generated/graphql";
import { Context, MeetingTypeProps } from "../pages/_app";
import { ContextType, dayOfTheWeek } from "../static/types";

export const useIsMeeting = (
  setOnMeeting: React.Dispatch<React.SetStateAction<MeetingTypeProps>>
) => {
  const { setTodayMeeting, schedules, setTodayMeetingNotJoin } = useContext(
    Context
  ) as ContextType;
  const [{ data, fetching }] = useGetSchedulesQuery();
  const router = useRouter();

  useEffect(() => {
    setTodayMeeting(0);
    setTodayMeetingNotJoin(0);
    if (schedules) {
      schedules.map((value) => {
        let time = value?.startAt
          .split(":")
          .map((value: string) => parseInt(value));
        const today = new Date();

        let meeting = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          time[0],
          time[1],
          0,
          0
        );

        setTodayMeeting((value) => value + 1);

        if (meeting.valueOf() - today.valueOf() > 0) {
          setTodayMeetingNotJoin((value) => value + 1);
          setTimeout(() => {
            setOnMeeting({
              url: `/meet/${
                value.id + value.startAt + value.createdAt
              }?scheduleId=${value.id}&time=${value.startAt + ":00"}`,
              content: `Đã bắt đầu tới giờ họp "${value.title}" vào lúc ${value.startAt}`,
            });
          }, meeting.valueOf() - today.valueOf());
        }
      });
    }
    // router.push(`/meet/${router.pathname}`);
  }, [schedules.length]);

  if (!data?.getSchedules) return null;
};
