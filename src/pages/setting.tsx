import React from "react";

// Layout
import Layout from "../layout/Layout";
import { useIsAuth } from "../utils/useIsAuth";

interface SettingProps {}

const Setting: React.FC<SettingProps> = ({}) => {
  if (!useIsAuth()) {
    return null;
  }

  return <Layout></Layout>;
};

export default Setting;
