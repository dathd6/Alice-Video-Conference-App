import React from "react";

// Layout
import Layout from "../layout/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Header from "../components/header/Header";
import Top from "../../public/icon/star.svg";
import ListDocument from "../components/document/ListDocument";
import { useIsAuth } from "../utils/useIsAuth";

interface DocumentProps {}

const Document: React.FC<DocumentProps> = ({}) => {
  if (!useIsAuth()) {
    return null;
  }

  return (
    <Layout>
      <Header title={"Danh sách biên bản"} icon={<Top />} />
      <ListDocument />
    </Layout>
  );
};

export default Document;
