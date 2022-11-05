import React from "react";
import styled from "styled-components";

// module scss
import icon from "../../styles/module/search.module.scss";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [text, setText] = React.useState("");

  return (
    <Container>
      <Title>{title}</Title>
      <InputContainer>
        <Input
          placeholder="Find your member"
          value={text}
          onChange={({ target }: any) => {
            setText(target.value);
          }}
        />
        <span
          onClick={() => {
            if (text !== "") setText("");
          }}
          className={text === "" ? icon.search : `${icon.search} ${icon.close}`}
        />
      </InputContainer>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Title = styled.h1``;

const InputContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const Input = styled.input`
  border-radius: 1rem;
  background-color: rgb(247, 249, 253);
  border: 0;
  padding: 1.2rem 2rem;
  width: 30rem;

  box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset,
    rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;

  &:focus-visible {
    outline: none;
  }
`;
