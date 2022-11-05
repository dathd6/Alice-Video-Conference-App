import React from "react";
import styled from "styled-components";

import Link from "next/link";

interface WelcomeProps {}

const Welcome: React.FC<WelcomeProps> = ({}) => {
  return (
    <Statistic>
      <Title>{"Xin chào"}</Title>
      <Content>
        <TextContainer>
          Chào bạn đã quay lại hệ thống, hãy xem chi tiết các cuộc họp của bạn
          bên dưới.
        </TextContainer>
        <Link href="/schedule">
          <Button>Xem lịch</Button>
        </Link>
      </Content>
    </Statistic>
  );
};

export default Welcome;

const TextContainer = styled.div`
  text-align: center;
  font-size: 1.4rem;
  padding: 1.2rem 4rem;
  width: 35rem;
`;

const Button = styled.div`
  background-color: #1da1f2;
  padding: 1.4rem 3rem;
  margin-bottom: 1.4rem;
  border-radius: 4rem;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
`;

const Statistic = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 700;

  z-index: 10;
  height: 17rem;
`;

const Title = styled.h2`
  padding: 1.5rem 4rem;
  font-size: 2rem;
  border-bottom: solid 0.1rem #ebeef0;
`;
