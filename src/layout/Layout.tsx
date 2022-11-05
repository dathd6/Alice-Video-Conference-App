import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import RightSideBar from "../components/navbar/RightSideBar";
import styled from "styled-components";
import MeetForm from "../components/meet/MeetForm";
import FormCenter from "../components/card/FormCenter";
import { useIsMeeting } from "../utils/useIsMeeting";
import RequestMeeting from "../components/meet/RequestMeeting";
import {
  ScheduleFragmentFragment,
  UserFragmentFragment,
} from "../generated/graphql";
import { Context, MeetingTypeProps } from "../pages/_app";
import { ContextType } from "../static/types";
import ChatBox from "../components/card/ChatBox";
import MessageList from "./sidebar/MessageList";

interface ContainerProps {
  calendar?: boolean;
  document?: boolean;
  form?: JSX.Element;
}

const Container: React.FC<ContainerProps> = ({
  calendar,
  document,
  form,
  children,
}) => {
  const [onForm, setOnForm] = useState(false);
  const { onMeeting, setOnMeeting, socket, chats } = useContext(
    Context
  ) as ContextType;

  useIsMeeting(setOnMeeting);

  return (
    <div className={`container ${document ? "container_special" : ""}`}>
      {onForm ? (
        <FormCenter setOnForm={setOnForm}>
          <MeetForm />
        </FormCenter>
      ) : null}

      {onMeeting ? (
        <FormCenter>
          <RequestMeeting />
        </FormCenter>
      ) : null}

      {form}

      <div className="container_navbar">
        <Navbar document={document} setOnForm={setOnForm} />
      </div>
      <div
        style={{ marginRight: document ? "3rem" : null }}
        className="container_content"
      >
        <div
          style={{ width: document ? "65vw" : null }}
          className="container_content_main"
        >
          {children}
        </div>
        <div
          style={{ display: calendar ? "none" : null }}
          className="container_content_support"
        >
          <RightSideBar document={document} />
        </div>
      </div>
      <MessageList />
    </div>
  );
};

export default Container;
