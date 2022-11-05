import React, { useContext, useState } from "react";
import styled from "styled-components";

// icon
import ClockIcon from "../../../public/icon/clock.svg";
import TeamIcon from "../../../public/icon/team.svg";
import RejectIcon from "../../../public/icon/rejected.svg";
import { Polar } from "react-chartjs-2";
import { useDocumentsQuery, useMeQuery } from "../../generated/graphql";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

interface StatsProps {}

const getTimeRender = (input: number) => {
  let time = input / 1000;
  let hours = Math.floor(time / (60 * 60));

  let divisor_for_minutes = time % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  // setTimeout(() => {
  //   setTime(() => meetingStatedTime.valueOf() - new Date().valueOf());
  // }, 1000);

  if (hours !== 0) {
    return { time: hours, label: "giờ" };
  } else if (minutes !== 0) return { time: minutes, label: "phút" };
  else return { time: seconds, label: "giây" };
};

const Stats: React.FC<StatsProps> = ({}) => {
  const [{ data }] = useMeQuery();
  const { todayMeeting, todayMeetingNotJoin } = useContext(
    Context
  ) as ContextType;
  const [document] = useDocumentsQuery();

  const [stats, setStats] = useState([
    {
      name: getTimeRender(data?.me?.timeSpend).label,
      account: getTimeRender(data?.me?.timeSpend).time,
      icon: <ClockIcon />,
      background: "#e5f6ff",
      text_color: "#4d89ff",
      icon_background: "#b7e6ff",
    },
    {
      name: "biên bản",
      account: document?.data?.documents ? document?.data?.documents.length : 0,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-file-text-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
        </svg>
      ),
      background: "#f6f3ff",
      text_color: "#5f4aba",
      icon_background: "#d9d3ff",
    },
    {
      name: "tham gia",
      account: data?.me?.joined,
      icon: <TeamIcon />,
      background: "#e2f6e9",
      text_color: "#6bb081",
      icon_background: "#c3e8d1",
    },
    {
      name: "hủy",
      account: data?.me?.cancel,
      icon: <RejectIcon />,
      background: "#fff0e9",
      text_color: "#ff5930",
      icon_background: "#ffdac9",
    },
  ]);

  return (
    <Statistic>
      <Title>{"Thông số"}</Title>

      <Wrap>
        <Stat>
          <Container>
            {stats.map(
              (
                {
                  icon_background,
                  account,
                  background,
                  icon,
                  name,
                  text_color,
                },
                index
              ) => {
                return (
                  <Card key={index} color={background}>
                    <Icon
                      //@ts-ignore
                      fill={text_color}
                      color={icon_background}
                    >
                      {icon}
                    </Icon>
                    <Content>
                      <Account color={text_color}>{account}</Account>
                      <CardTitle>{name}</CardTitle>
                    </Content>
                  </Card>
                );
              }
            )}
          </Container>
        </Stat>
        <PolarContainer>
          <Polar
            options={{
              title: {
                display: true,
                text: "Hoạt động hôm nay",
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
            data={{
              datasets: [
                {
                  data: [
                    todayMeeting,
                    todayMeetingNotJoin,
                    todayMeeting - todayMeetingNotJoin,
                  ],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                  ],
                  borderWidth: 1,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ["Cuộc họp hôm nay", "Chưa tham gia", "Đã tham gia"],
            }}
          />
        </PolarContainer>
      </Wrap>
    </Statistic>
  );
};

export default Stats;

const PolarContainer = styled.div`
  padding: 0 1rem;
`;

const Stat = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrap = styled.div`
  position: relative;
  /* height: calc(100vh - 19.6rem - 20rem - 10.8rem); */
`;

const Statistic = styled.div`
  padding-bottom: 1.2rem;
  height: calc(100vh);
`;

const Container = styled.div`
  margin: 1rem 0;
  /* border: dashed 0.3rem #adadad; */
  padding: 1.2rem 1.2rem;
  width: fit-content;
  display: grid;
  border-radius: 3rem;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.2rem;
`;

const Account = styled.h1`
  color: ${(props: any) => props.color};
  font-size: 3rem;
  text-align: center;
`;

const CardTitle = styled.div`
  font-weight: 500;
  font-size: 1.5rem;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  width: 6.3rem;

  /* z-index: 10; */
`;

const Icon = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 100%;
  background-color: ${(props: any) => props.color};
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 70%;
    height: 70%;
    path {
      fill: ${(props: any) => props.fill};
    }
  }
`;

const Card = styled.div`
  background: ${(props: any) => props.color};
  border-radius: 1.6rem;
  padding: 1.2rem 1.5rem;
  width: 21rem;
  height: 9rem;

  display: flex;
  align-items: center;
  justify-content: center;

  /* &:not(:last-child) {
    margin-bottom: 2rem;
  } */
`;

const Title = styled.h2`
  padding: 1.5rem 4rem;
  font-size: 2rem;
  border-bottom: solid 0.1rem #ebeef0;
`;
