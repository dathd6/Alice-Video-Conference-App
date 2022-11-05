import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Layout
import Layout from "../layout/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Header from "../components/header/Header";
import UpcomingMeeting from "../layout/home/UpcomingMeeting";
import BackArrow from "../../public/icon/left-arrow.svg";
import ForwardArrow from "../../public/icon/right-arrow.svg";
import TimeSchedule from "../layout/home/TimeSchedule";
import { useIsAuth } from "../utils/useIsAuth";
import FormCenter from "../components/card/FormCenter";
import ScheduleForm from "../components/schedule/ScheduleForm";
import { useRouter } from "next/router";
import { ScheduleFragmentFragment } from "../generated/graphql";

interface ScheduleProps {}

const Schedule: React.FC<ScheduleProps> = ({}) => {
  const [form, setForm] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleFragmentFragment>();

  if (!useIsAuth()) {
    return null;
  }

  return (
    <Layout
      document
      form={
        form || schedule ? (
          <FormCenter setOnForm={setForm} setSchedule={setSchedule}>
            <ScheduleForm setForm={setForm} schedule={schedule} setSchedule={setSchedule}/>
          </FormCenter>
        ) : null
      }
    >
      <Header
        title={
          <Title>
            <Icon
              onClick={() => {
                setDate((d) => {
                  d.setDate(d.getDate() - 1);
                  var newDate = new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate()
                  );
                  return newDate;
                });
              }}
            >
              <BackArrow />
            </Icon>
            <Icon
              onClick={() => {
                setDate((d) => {
                  d.setDate(d.getDate() + 1);
                  var newDate = new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate()
                  );
                  return newDate;
                });
              }}
            >
              <ForwardArrow />
            </Icon>
            <Text>
              Ngày {date.getDate()} tháng {date.getMonth() + 1}{" "}
              <span>
                {date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
                  ? "Hôm nay"
                  : null}
              </span>
            </Text>

            <svg
              onClick={() => setForm(true)}
              style={{
                marginLeft: "1rem",
                cursor: "pointer",
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-calendar-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
            </svg>
          </Title>
        }
        icon={
          <Time>
            <Active></Active>
            {
              //@ts-ignore
              <TimeButton active>Ngày</TimeButton>
            }
            <TimeButton>Tuần</TimeButton>
          </Time>
        }
      />
      <Content>
        <TimeSchedule />
        <UpcomingMeeting date={date} setSchedule={setSchedule} />
      </Content>
    </Layout>
  );
};

export default Schedule;

const Content = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
`;

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
