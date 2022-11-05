import React, { useRef, useState } from "react";

import style from "../../styles/module/detail.module.scss";
import { useRouter } from "next/router";
import { useDocumentQuery } from "../../generated/graphql";

interface TranscriptSideProps {}

const TranscriptSide: React.FC<TranscriptSideProps> = ({}) => {
  const renderTime = (time: number) => {
    return time > 9 ? time : "0" + time;
  };

  const videoRef = useRef<any>();

  const msToTime = (s: number) => {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs === 0
      ? mins + ":" + renderTime(secs)
      : hrs + ":" + renderTime(mins) + ":" + renderTime(secs);
  };

  const [currentTime, setCurrentTime] = useState(0);

  const router = useRouter();

  const [{ data }] = useDocumentQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

  if (!data?.document) return <div></div>;

  return (
    <div className={style.container} style={{ padding: 0 }}>
      <div className={style.video}>
        <div className={style.video_title}>Video cuộc họp</div>
        <div className={style.video_content}>
          <video
            ref={videoRef}
            onTimeUpdate={({ target }: any) => {
              setCurrentTime(target.currentTime);
            }}
            src={data.document.document.record}
            controls
          />
        </div>
      </div>

      <div className={style.grid} style={{ gridTemplateColumns: "1fr" }}>
        <div className={style.transcript} style={{ width: "80%" }}>
          <ul className={style.transcript_list}>
            {data.document.document.transcripts
              .sort((a, b) => {
                return b.startedAt - a.startedAt;
              })
              .map(
                (
                  {
                    context,
                    type,
                    userId,
                    startedAt,
                    user: { avatar, fullname },
                  },
                  index
                ) => {
                  //   console.log(
                  //     Math.floor(time / 1000),
                  //     Math.floor(currentTime),
                  //     Math.floor(time / 1000) === Math.floor(currentTime)
                  //   );
                  const startedTime = data?.document?.document?.recordStartedAt;
                  // console.log(
                  //   new Audio(data?.document?.document?.record).duration
                  // );

                  const endTime =
                    Math.floor(videoRef.current?.duration) * 1000 + startedTime;

                  if (startedAt >= startedTime && endTime >= startedAt)
                    return (
                      <li
                        key={index}
                        className={
                          Math.floor(videoRef.current?.currentTime) -
                            Math.floor((startedAt - startedTime) / 1000) >=
                          0
                            ? style.transcript_list_detail + " " + "fade"
                            : style.transcript_list_detail
                        }
                        style={{
                          display:
                            Math.floor(videoRef.current?.currentTime) -
                              Math.floor((startedAt - startedTime) / 1000) >=
                            0
                              ? ""
                              : "none",
                        }}
                      >
                        <div className={style.transcript_list_detail_avatar}>
                          <img src={avatar} alt="" />
                        </div>
                        <div className={style.transcript_list_detail_info}>
                          <div
                            className={
                              style.transcript_list_detail_info_username
                            }
                          >
                            {fullname}
                          </div>

                          <div
                            className={style.transcript_list_detail_info_time}
                          >
                            {/* {msToTime(start)} */}
                            {msToTime(startedAt - startedTime)}
                          </div>
                          <div
                            style={{
                              color: type === "file" ? "#1da1f2" : "#000",
                            }}
                            className={style.transcript_list_detail_info_text}
                          >
                            {type === "image" ? (
                              <img src={context} alt="" width="200px" />
                            ) : (
                              <>
                                {type === "file" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-file-code"
                                    viewBox="0 0 16 16"
                                    style={{ marginRight: 5 }}
                                  >
                                    <path d="M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zm2.708 0a.5.5 0 1 0-.708.708L10.293 8 8.646 9.646a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z" />
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                                  </svg>
                                ) : null}
                                {context}
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                }
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TranscriptSide;
