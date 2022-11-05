import React from "react";

import styled from "styled-components";
import BackIcon from "../../../public/icon/back.svg";

interface HeaderProps {
  title: any;
  icon: any;
}

const Header: React.FC<HeaderProps> = ({ title, icon }) => {
  return (
    <Container>
      <Content>
        <Wrap>
          {title === "Document Detail" ? (
            <Back>
              <BackIcon />
            </Back>
          ) : null}

          {title}
        </Wrap>
        <Icon>{icon}</Icon>
      </Content>
    </Container>
  );
};

export default Header;

const Wrap = styled.div`
  display: flex;
  align-items: center;
`;

const Back = styled.div`
  margin-right: 1.5rem;
`;

const Content = styled.div`
  z-index: 1000;
  top: 0;
  background-color: #fff;
  position: fixed;
  border-right: solid 0.1rem #ebeef0;
  border-bottom: solid 0.1rem #ebeef0;
  padding: 1.6rem;
  font-size: 1.6rem;
  width: inherit;
  font-size: 1.6rem;
  font-weight: bold;
`;

const Icon = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.6rem;
  width: 4rem;
  height: 4rem;
  display: flex;
  border-radius: 100%;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #1da0f218;
  }
`;

const Container = styled.div`
  position: relative;
  width: inherit;
  border-bottom: solid 0.1rem #ebeef0;
  height: 5.2rem;

  svg {
    width: 2rem;
    height: 2rem;

    path {
      fill: #1da1f2;
    }
  }
`;
