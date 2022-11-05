import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";

interface EmptyProps {}

const Empty: React.FC<EmptyProps> = ({}) => {
  const empty = useRef();

  useEffect(() => {
    lottie.loadAnimation({
      container: empty.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/13525-empty.json"),
    });
  }, []);

  return (
    <div style={{ height: "calc(100vh - 5.3rem)" }}>
      <div style={{ width: "100%" }} ref={empty}></div>
    </div>
  );
};

export default Empty;
