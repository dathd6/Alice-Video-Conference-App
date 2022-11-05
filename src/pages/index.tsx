import React from "react";

// Layout
import Layout from "../layout/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Header from "../components/header/Header";
import MeetForm from "../components/meet/MeetForm";
import styled from "styled-components";
import Welcome from "../components/card/Welcome";
import Stats from "../components/card/Stats";
import Top from "../../public/icon/star.svg";
import { useMeQuery } from "../generated/graphql";
import Introduction from "../components/card/Introduction";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const [{ data }] = useMeQuery();

  return (
    <Layout>
      <Header title={"Trang chủ"} icon={<Top />} />
      <MeetForm />
      <Seperate />
      <Welcome />
      <Seperate />
      {data?.me ? <Stats /> : <Introduction />}
      {/* <UpcomingMeeting /> */}
    </Layout>
  );
};

export default Home;

const Seperate = styled.div`
  height: 1.2rem;
  border-top: solid 0.1rem #ebeef0;
  border-bottom: solid 0.1rem #ebeef0;
  background-color: #f7f9fa;
`;
