import Link from "next/link";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import ArrowIcon from "../../../public/icon/more.svg";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { Context } from "../../pages/_app";
import { ContextType } from "../../static/types";

import style from "../../styles/module/auth.module.scss";

interface NavbarAvatarProps {}

const NavbarAvatar: React.FC<NavbarAvatarProps> = ({}) => {
  const { setNotifications, setTodayMeetingNotJoin } = useContext(
    Context
  ) as ContextType;
  const [{ data }] = useMeQuery();
  const [, logout] = useLogoutMutation();
  const [click, setClick] = useState(false);

  if (data?.me) {
    return (
      <div className="navbar_profile" onClick={() => setClick(!click)}>
        {/* {click ? ( */}
        <div
          className="navbar_profile_logout"
          onClick={() => {
            setNotifications([]);
            setTodayMeetingNotJoin(0);
            logout();
          }}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-box-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
              />
              <path
                fillRule="evenodd"
                d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
              />
            </svg>
            <div>Đăng xuất</div>
          </div>
        </div>
        {/* ) : null} */}
        <img src={data.me.avatar} alt="" />
        <div className="navbar_profile_info">
          <div className="navbar_profile_info_title">{data.me.fullname}</div>
          <div className="navbar_profile_info_hashtag">
            {"@" + data.me.username}
          </div>
        </div>

        <div className="navbar_profile_icon">
          <ArrowIcon />
        </div>
      </div>
    );
  } else {
    return (
      <div className={style.bottom}>
        <div className={style.header}>Tham gia nào !!! </div>
        <div className={style.wrap}>
          <Link href="/auth">
            <div className={style.login_navbar}></div>
          </Link>
          <Link href="/auth">
            <div className={style.register_navbar}></div>
          </Link>
        </div>
      </div>
    );
  }
};

export default NavbarAvatar;

const Logout = styled.div``;

const Header = styled.div`
  margin-bottom: 1.2rem;
  font-weight: 700;
`;
const Wrap = styled.div`
  display: flex;
`;

const Bottom = styled.div`
  /* background-color: #1da1f2; */
  position: absolute;
  bottom: 0;
  left: 0rem;
  width: 100vw;
  height: 10rem;
  font-size: 1.5rem;

  z-index: 1000000;
`;

const Login = styled.div`
  cursor: pointer;
  color: #1da1f2;
  border: solid 0.1rem #1da1f2;
  width: fit-content;
  height: fit-content;
  padding: 1.2rem 2.5rem;
  border-radius: 2.5rem;
  margin-right: 1rem;
`;

const Register = styled.div`
  cursor: pointer;

  color: #fff;
  background-color: #1da1f2;
  /* border: solid 0.1rem #1da1f2; */
  width: fit-content;
  height: fit-content;
  padding: 1.2rem 2.5rem;
  border-radius: 2.5rem;

  /* @media only screen and (max-width: 1280px) {
    display: none;
  } */
`;
