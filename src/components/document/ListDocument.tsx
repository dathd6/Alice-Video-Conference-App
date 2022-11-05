import React, { useContext } from "react";

import style from "../../styles/module/list_document.module.scss";
import { ContextType, month } from "../../static/types";
import { useRouter } from "next/router";
import {
  useDocumentsQuery,
  useSeenNotificationMutation,
} from "../../generated/graphql";
import Empty from "../card/Empty";
import { Context } from "../../pages/_app";

interface ListDocumentProps {}

const ListDocument: React.FC<ListDocumentProps> = ({}) => {
  const { notifications, setNotifications } = useContext(
    Context
  ) as ContextType;
  const router = useRouter();

  const [{ data }] = useDocumentsQuery();

  const seenMap = (() => {
    const result: Record<number, number> = {};
    notifications.forEach(({ url, type, id, isSeen }) => {
      if (type === "document" && isSeen === false) {
        const documentId = parseInt(url.split("/")[url.split("/").length - 1]);
        if (!isNaN(documentId)) {
          result[documentId] = id;
        }
      }
    });
    return result;
  })();

  const [, seen] = useSeenNotificationMutation();

  if (!data?.documents) return <div></div>;

  return (
    <ul className={style.container}>
      {data.documents.length === 0 ? (
        <Empty />
      ) : (
        data.documents
          .sort((a, b) => b.id - a.id)
          .map(({ id, schedule, title, createdAt }, index) => {
            return (
              <li key={index} className={style.document}>
                <div className={style.header}>
                  <div className={style.month}>
                    {month[parseInt(createdAt.split("-")[1])]}
                  </div>
                  <div className={style.day}>
                    {createdAt.split("-")[2].substring(0, 2)}
                  </div>
                  <div className={style.year}>{createdAt.split("-")[0]}</div>
                </div>

                <div className={style.content}>
                  {seenMap[id] ? (
                    <div className={style.new}>
                      <img src={"images/new-512.png"} alt="" />
                    </div>
                  ) : null}
                  <div
                    onClick={() => {
                      seen({ id: seenMap[id] });
                      setNotifications((notifications) =>
                        notifications.map((noti) => {
                          if (noti.id === seenMap[id])
                            return { ...noti, isSeen: true };
                          else return noti;
                        })
                      );
                      router.push(`/document/${id}`);
                    }}
                    className={style.title}
                  >
                    {title}
                  </div>
                  <div className={style.sub_title}>
                    <span className={style.underline}>Bắt đầu lúc</span>
                    {": "}
                    {schedule.startAt}
                    {/* <span>{`${date.getHours()}h${date.getMinutes()}m${date.getSeconds()}s`}</span> */}
                  </div>
                  <div className={style.sub_title}>
                    <span className={style.underline}>Mô tả</span>
                    {": "}
                    <span>
                      {schedule.description === ""
                        ? "Chưa có"
                        : schedule.description}
                    </span>
                  </div>
                  <div className={style.sub_title}>
                    <span className={style.underline}>Tổ chức</span>
                    {": "}
                    <span>
                      {schedule.company === "" ? "Chưa có" : schedule.company}
                    </span>
                  </div>

                  <div className={style.host}>
                    <img
                      className={style.host_avatar}
                      src={schedule.host.avatar}
                    />
                    <div className={style.host_info}>
                      <div className={style.host_info_name}>
                        {schedule.host.username}
                      </div>
                      <div className={style.host_info_job}>Host</div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
      )}
      <div
        style={{ width: "100%", height: "calc(100vh - 5.3rem - 17rem)" }}
      ></div>
    </ul>
  );
};

export default ListDocument;
