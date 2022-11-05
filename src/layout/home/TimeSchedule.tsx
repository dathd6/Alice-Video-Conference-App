import React from "react";
import styled from "styled-components";

interface TimeScheduleProps {}

const TimeSchedule: React.FC<TimeScheduleProps> = ({}) => {
  const timeRender = (hour: number) => {
    if (hour > 12) {
      return hour - 12 > 9 ? hour - 12 + ":00pm" : "0" + (hour - 12) + ":00pm";
    } else {
      return hour > 9 ? hour + ":00am" : "0" + hour + ":00am";
    }
  };

  return (
    <Container>
      {time.map((hour) => {
        return <Item key={hour}>{timeRender(hour)}</Item>;
      })}
    </Container>
  );
};

export default TimeSchedule;

const time = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const Container = styled.ul``;

const Item = styled.li`
  width: 100%;
  height: 12rem;
  border-right: solid 0.1rem #e5e5e9;
  border-bottom: solid 0.1rem #e5e5e9;

  padding-top: 2rem;
  display: flex;
  justify-content: center;

  font-size: 1.6rem;
  color: #9da9bb;
`;
