import React from "react";
import styled from "styled-components";

// Layout
import Layout from "../../layout/Layout";
import Header from "../../components/header/Header";
import Top from "../../../public/icon/star.svg";
import Introduction from "../../components/document/Introduction";
import Detail from "../../components/document/Detail";
import { useIsAuth } from "../../utils/useIsAuth";
import { useRouter } from "next/router";

interface DocumentDetailProps {}

const DocumentDetail: React.FC<DocumentDetailProps> = ({}) => {
  const router = useRouter();
  if (!useIsAuth()) {
    return null;
  }

  return (
    <Layout document>
      <Header
        title={
          <Title>
            <Icon onClick={() => router.back()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
            </Icon>
            <Text>Chi tiết biên bản</Text>
          </Title>
        }
        icon={<Top />}
      />
      <Introduction />
      <Detail />
    </Layout>
  );
};

export default DocumentDetail;

const Text = styled.div`
  margin-left: 1rem;
  span {
    color: #9da9bb;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  margin-right: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
