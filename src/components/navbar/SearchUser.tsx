import React from "react";
import style from "../../styles/module/search.module.scss";
import { useSearchUserQuery } from "../../generated/graphql";

import AddFriendIcon from "../../../public/icon/add-friend.svg";
import PendingIcon from "../../../public/icon/pending.svg";
import { useRouter } from "next/router";

interface SearchUserProps {}

const SearchUser: React.FC<SearchUserProps> = ({}) => {
  const [text, setText] = React.useState("");
  const [{ data }] = useSearchUserQuery({
    variables: {
      search: text,
    },
  });
  const router = useRouter();

  return (
    <div className={style.input}>
      <input
        placeholder="Tìm bạn bè"
        value={text}
        onChange={({ target }: any) => {
          setText(target.value);
        }}
      />
      <span
        onClick={() => {
          if (text !== "") setText("");
        }}
        className={
          text === "" ? style.search : `${style.search} ${style.close}`
        }
      />
      <ul
        className={style.content}
        style={{
          display: text !== "" ? "flex" : "none",
        }}
      >
        <div key={-1} className={style.header}>
          <div className={style.wrap}>
            <div className={style.title}>Tìm kiếm</div>
            <div className={style.more}>Xem thêm</div>
          </div>
          <div className={style.border}></div>
        </div>
        {data?.searchUser.map(({ user, relationship }, key) => {
          return (
            <li
              key={key}
              className={style.item}
              onClick={() => router.push(`/profile/${user.id}`)}
            >
              <div className={style.avatar}>
                <img src={user.avatar} alt="" />
              </div>
              <div className={style.info}>
                <div className={style.username}>
                  <p>{user.fullname} </p>
                  <svg
                    viewBox="0 0 24 24"
                    aria-label="Verified account"
                    className="r-13gxpu9 r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                  >
                    <g>
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
                    </g>
                  </svg>
                </div>
                <div className={style.tag}>{"@" + user.username}</div>
              </div>
              <div className={style.icon}>
                <AddFriendIcon />
                {/* <PendingIcon /> */}

                {/* <p>Profile</p> */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchUser;
