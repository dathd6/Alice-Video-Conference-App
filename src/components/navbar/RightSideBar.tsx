import { useRouter } from "next/router";
import React from "react";
import { useMeQuery } from "../../generated/graphql";

import Calendar from "../../layout/sidebar/Calendar";
import FriendList from "../../layout/sidebar/FriendList";
import Detail from "../document/Detail";
import Transcript from "../document/TranscriptSide";
import Recommend from "../list/Recommend";
import SearchUser from "./SearchUser";

interface RightSideBarProps {
  document?: boolean;
}

const RightSideBar: React.FC<RightSideBarProps> = ({ document, children }) => {
  const router = useRouter();
  const [{ data }] = useMeQuery();

  return (
    <div
      className="side"
      style={{ width: router.route !== "/document/[id]" ? "33rem" : "25vw" }}
    >
      {router.route !== "/document/[id]" ? (
        <div style={{}}>
          <SearchUser />
          <Calendar />
          {data?.me ? (
            <>
              <FriendList />
              <Recommend />
            </>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <Transcript />
      )}
    </div>
  );
};

export default RightSideBar;
