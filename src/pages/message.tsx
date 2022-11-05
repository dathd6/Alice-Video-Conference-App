import React from "react";

// Layout
import Layout from "../layout/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

interface MessageProps {}

const Message: React.FC<MessageProps> = ({}) => {
  if (!useIsAuth()) {
    return null;
  }

  return <Layout></Layout>;
};

export default Message;
