import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import _ from "lodash";

import { nav_items } from "../../static/items";
import { useRouter } from "next/router";
import NavbarAvatar from "./NavbarAvatar";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

interface NavbarProps {
  document?: boolean;
  setOnForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ document, setOnForm }) => {
  const { notifications, todayMeetingNotJoin } = useContext(
    Context
  ) as ContextType;
  const router = useRouter();

  let noti = _.sum(notifications.map(({ isSeen }) => (!isSeen ? 1 : 0)));

  let documentNoti = _.sum(
    notifications.map(({ isSeen, type }) =>
      !isSeen && type === "document" ? 1 : 0
    )
  );

  return (
    <div className={`navbar ${document ? "navbar_reduce" : ""}`}>
      <Link href="/">
        <div className="navbar_title">
          {/* Alice */}
          <div className="navbar_title_icon">
            <img src="/icon/Alice.png" alt="" />
          </div>
        </div>
      </Link>

      <ul className="navbar_container">
        {nav_items.map(({ icon_active, icon, text, href }, index) => {
          return (
            <li
              key={index}
              className={router.route === href ? "navbar_item_active" : null}
            >
              <Link href={href}>
                <div className="navbar_item_wrap" style={{ display: "flex" }}>
                  <div className="icon_container">
                    {router.route !== href ? icon : icon_active}
                    {href === "/notification" && noti > 0 ? (
                      <div className="icon_container_notify">{noti}</div>
                    ) : null}
                    {href === "/schedule" && todayMeetingNotJoin > 0 ? (
                      <div className="icon_container_notify">
                        {todayMeetingNotJoin}
                      </div>
                    ) : null}
                    {href === "/document" && documentNoti > 0 ? (
                      <div className="icon_container_notify">
                        {documentNoti}
                      </div>
                    ) : null}
                  </div>
                  <div className="navbar_item_text">{text}</div>
                </div>
              </Link>
            </li>
          );
        })}
        <li key={nav_items.length} onClick={() => setOnForm(true)}>
          <a className="navbar_btn">
            {/* <MeetIcon />+ */}
            <span>
              <p>A</p>lice
            </span>
          </a>
        </li>
      </ul>

      <NavbarAvatar />
    </div>
  );
};

export default Navbar;

const Background = styled.div`
  position: absolute;
  width: 200vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.246);
`;

const Position = styled.div`
  z-index: 10000;
  top: -1rem;
  left: -100vh;

  position: absolute;
  width: 200vw;
  height: 100vh;
`;

const Wrap = styled.div`
  z-index: 10001;
  position: absolute;
  width: 50rem;
  background: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
