import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useScrollBoost } from "react-scrollbooster";

// components
import MeetingCard from "../../components/card/MeetingCard";
import {
  Schedule,
  ScheduleFragmentFragment,
  useGetSchedulesQuery,
} from "../../generated/graphql";
import { ContextType, dayOfTheWeek } from "../../static/types";
import { Context } from "../../pages/_app";

interface UpcomingMeetingProps {
  date: Date;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleFragmentFragment>>;
}

interface ScheduleMap {
  value: ScheduleFragmentFragment;
  front: number;
  back: number;
}

const UpcomingMeeting: React.FC<UpcomingMeetingProps> = ({
  date,
  setSchedule,
}) => {
  const { socket, schedules, setSchedules, notifications } = useContext(
    Context
  ) as ContextType;

  const [viewport, scrollbooster] = useScrollBoost({
    direction: "vertical",
    friction: 0.2,
    scrollMode: "native",
    bounce: true,
    // ...optional options
  });

  const seenMap = (() => {
    const result: Record<number, boolean> = {};
    notifications.forEach(({ url, isSeen, type }) => {
      if (type === "schedule") {
        result[parseInt(url)] = isSeen;
      }
    });
    return result;
  })();

  useEffect(() => {
    setSchedules(
      schedules.filter((value) => {
        return (
          value.dateType === "all" ||
          value?.dateType.includes(dayOfTheWeek[date.getDay()]) ||
          value?.dateType ===
            `${date.getFullYear()}-${
              date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1
            }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`
        );
      })
    );
  }, [date, schedules.length]);

  const toScheduleMap = (schedule: ScheduleFragmentFragment[]) => {
    const scheduleMap: Record<number, ScheduleMap> = {};
    if (schedule) {
      schedule.forEach((value) => {
        if (!value) return;
        let time = value.startAt.split(":");
        scheduleMap[parseInt(time[0]) * 60 + parseInt(time[1])] = {
          value,
          front: 0,
          back: 0,
        };
      });

      for (var sch in scheduleMap) {
        let i = parseInt(sch) - 1;
        let back = 0;
        while (i > parseInt(sch) - 76 && i >= 0) {
          if (scheduleMap[i]) back++;
          i--;
        }
        let front = 0;
        let j = parseInt(sch) + 1;
        while (j < parseInt(sch) + 76) {
          if (scheduleMap[j]) front++;
          j++;
        }

        scheduleMap[sch].back = back;
        scheduleMap[sch].front = front;
      }
    }

    return scheduleMap;
  };

  const schedule = toScheduleMap(schedules);

  const stateSchedule = (schedule: ScheduleFragmentFragment) => {
    const today = new Date();
    if (date.getFullYear() > today.getFullYear()) {
      return true;
    } else if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() > today.getMonth()
    ) {
      return true;
    } else if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() > today.getDate()
    ) {
      return true;
    }
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      let time = schedule?.startAt.split(":").map((value) => parseInt(value));

      let meeting = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        time[0],
        time[1],
        0,
        0
      );
      if (meeting.valueOf() - today.valueOf() > 0) {
        return true;
      }
    }

    return false;
  };

  return (
    <MeetingContainer ref={viewport}>
      <Background>
        {time.map((_, index) => {
          return <Border key={index}></Border>;
        })}
      </Background>
      <Container>
        {Array.from({ length: 960 }, (_, index) => index).map((i) => {
          const sch = schedule[6 * 60 + i];
          let hour: string | number = Math.floor((6 * 60 + i) / 60);
          let minute: string | number = 6 * 60 + i - hour * 60;

          hour = hour >= 10 ? hour : "0" + hour;
          minute = minute >= 10 ? minute : "0" + minute;
          if (!sch)
            return (
              <Time key={i} color={"#1da1f2"}>
                <p>{hour + ":" + minute}</p>
              </Time>
            );

          return (
            <Time key={i} color={"#fff"}>
              <ScheduleContainer
                //@ts-ignore
                margin={`${sch.back * 4}rem`}
                width={`${100 - 5 * (sch.back + sch.front)}%`}
              >
                {schedule[6 * 60 + 0 + i] ? (
                  <MeetingCard
                    schedule={sch.value}
                    isSeen={seenMap[sch.value?.id]}
                    isUpcoming={stateSchedule(sch.value)}
                    setSchedule={setSchedule}
                  />
                ) : (
                  <></>
                )}
              </ScheduleContainer>
            </Time>
          );
        })}
        {/* {data.getSchedules.map((meet, index) => {
          return (
            <div key={index}>
              <MeetingCard schedule={meet} />
            </div>
          );
        })} */}
      </Container>
    </MeetingContainer>
  );
};

export default UpcomingMeeting;

const NewCard = styled.div``;

const ScheduleContainer = styled.div`
  top: 0;
  bottom: 0;
  position: absolute;
  padding: 0 2rem;
  margin-left: ${(props: any) => props.margin};
  width: ${(props: any) => props.width};
  height: 15.2rem;

  .hidden_value {
    display: none;
  }

  &:hover {
    height: fit-content;
    z-index: 100;

    .hidden_value {
      display: grid;
      grid-template-columns: 3% 90%;
    }
  }
`;

const Time = styled.div`
  position: relative;
  width: 100%;
  height: 0.2rem;

  &:hover {
    background-color: ${(prop: any) => prop.color};
    position: absolute;
    right: 0;
    p {
      display: flex;

      align-items: center;
      justify-content: center;
    }
  }

  p {
    display: none;
    position: absolute;

    top: -1.5rem;
    left: 3.8rem;

    width: 8rem;
    height: 3rem;
    border-radius: 2rem;

    background-color: #1da1f2;
    font-size: 1.6rem;

    color: #fff;
  }
`;

const Border = styled.div`
  border-bottom: solid 0.1rem #e5e5e9;
  height: 6rem;
`;

const Background = styled.div`
  position: absolute;
  width: 80%;
  height: 100%;
  z-index: -1;
`;

const time = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
];

const MeetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }

  border-radius: 1rem;
`;

const Container = styled.div`
  z-index: 10;
`;
