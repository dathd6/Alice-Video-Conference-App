import React from "react";
import ClockIcon from "../../../public/icon/clock_v0.svg";
import NotificationIcon from "../../../public/icon/notification.svg";
import ArrowIcon from "../../../public/icon/down-arrow.svg";

interface SideNavbarProps {}

const SideNavbar: React.FC<SideNavbarProps> = ({}) => {
  return (
    <div className="navbar">
      <ul>
        {list_items.map(({ active, icon, noti }, index) => {
          return (
            <li
              style={{ marginRight: "1rem" }}
              key={index}
              className={active ? "navbar_item_active" : null}
            >
              <div className="icon_container">{icon}</div>
              {noti}
            </li>
          );
        })}
      </ul>
      <ul className="navbar_container">
        {profile.map(({ icon }, index) => {
          return (
            <li style={{ marginRight: 0 }} key={index}>
              <div className="icon_container">{icon}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNavbar;

const list_items = [
  {
    icon: <ClockIcon />,
    noti: <div className="navbar_noti">2</div>,
    active: true,
  },
  {
    icon: <NotificationIcon />,
    noti: <div className="navbar_noti">7</div>,
    active: false,
  },
];

const profile = [
  {
    icon: (
      <>
        <ArrowIcon />
        <img
          src="https://i.pinimg.com/474x/10/91/94/1091948c6b80b65b9eef8c163f0ae42a.jpg"
          alt=""
        />
      </>
    ),
  },
];
