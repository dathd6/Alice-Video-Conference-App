import React, { useContext, useState } from "react";
import styled from "styled-components";
import {
  ScheduleFragmentFragment,
  useMeQuery,
  useUpdateInfoMutation,
} from "../../generated/graphql";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

interface FormCenterProps {
  setOnForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setSchedule?: React.Dispatch<React.SetStateAction<ScheduleFragmentFragment>>;
  transparent?: boolean;
}

const FormCenter: React.FC<FormCenterProps> = ({
  children,
  setOnForm,
  transparent,
  setSchedule,
}) => {
  const { setOnMeeting } = useContext(Context) as ContextType;
  const [, update] = useUpdateInfoMutation();
  const [{ data }] = useMeQuery();

  return (
    <Position>
      <Background
        onClick={async () => {
          if (setOnForm) {
            setOnForm(false);
          }
          if (setSchedule) {
            setSchedule(null);
          }
          if (setOnMeeting) {
            update({ cancel: data?.me?.cancel + 1 });
            setOnMeeting(undefined);
          }
        }}
      ></Background>
      <Wrap
        theme={transparent ? "transparent" : "#fff"}
        style={{ borderRadius: "1rem" }}
      >
        {children}
      </Wrap>
    </Position>
  );
};

export default FormCenter;

const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #0000003e;
`;

const Position = styled.div`
  z-index: 10000;
  top: 0;
  left: 0;

  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Wrap = styled.div`
  z-index: 10001;
  position: absolute;
  min-height: 10rem;
  width: 50rem;
  /* min-height: 11rem; */
  background: ${(props: any) => props.theme};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
