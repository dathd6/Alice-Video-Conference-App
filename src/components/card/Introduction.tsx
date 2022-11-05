import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import lottie from "lottie-web";

interface IntroductionProps {}

const Introduction: React.FC<IntroductionProps> = ({}) => {
  const animation = useRef<any>();
  useEffect(() => {
    lottie.loadAnimation({
      container: animation.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/online-meeting.json"),
    });
  }, []);

  return (
    <Statistic>
      <Title>{"Create an account to improve productivity"}</Title>
      <Content>
        <Animation ref={animation} />
      </Content>
    </Statistic>
  );
};

export default Introduction;

const Animation = styled.div`
  width: 100%;
  height: calc(100vh - 50rem);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const Container = styled.div`
  text-align: center;
  font-size: 1.4rem;
  padding: 1.2rem 4rem;
  width: 40rem;
`;

const Title = styled.h2`
  padding: 1.5rem 4rem;
  font-size: 2rem;
  border-bottom: solid 0.1rem #ebeef0;
`;
