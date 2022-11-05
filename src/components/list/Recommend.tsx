import React from "react";

import MoreIcon from "../../../public/icon/others.svg";
// Module scss
import style from "../../styles/module/recommend.module.scss";

interface RecommendProps {}

const Recommend: React.FC<RecommendProps> = ({}) => {
  return (
    <div className={style.container}>
      <h1 className={style.header}>
        Gợi ý cho bạn
        {/* <div className={style.header_icon}>
          <MoreIcon />
        </div> */}
      </h1>
      <ul className={style.list}>
        {list_recommend.map(({ name, avatar, hashtag }, index) => {
          return (
            <div key={index} className={style.recommend}>
              <div className={style.avatar}>
                <img src={avatar} alt="" />
              </div>
              <div className={style.info}>
                <div className={style.name}>{name}</div>
                <div className={style.hashtag}>{hashtag}</div>
              </div>
              <div className={style.btn}>Follow</div>
            </div>
          );
        })}
        <div key={"unique"} className={style.recommend}>
          <div className={style.more}>Xem thêm</div>
        </div>
      </ul>
    </div>
  );
};

export default Recommend;

const list_recommend = [
  {
    name: "Binh",
    avatar:
      "https://i.pinimg.com/736x/c8/bd/a9/c8bda99ff35a1aca879a77d8dfb84dd2.jpg",
    hashtag: "#Binh",
  },
  {
    name: "Truong",
    avatar:
      "https://i.pinimg.com/originals/a4/2a/44/a42a4479c62c774b997cb4eff9ebb319.jpg",
    hashtag: "#TruongNguyen",
  },
  {
    name: "Yen",
    avatar: "https://www.abc.net.au/cm/rimage/12012776-3x2-xlarge.jpg?v=2",
    hashtag: "#Mom",
  },
];
