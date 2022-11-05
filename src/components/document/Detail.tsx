import React, { useEffect, useState } from "react";

import style from "../../styles/module/detail.module.scss";
import SearchIcon from "../../../public/icon/search.svg";
import EditIcon from "../../../public/icon/edit.svg";
import { Pie, Line } from "react-chartjs-2";
import { useRouter } from "next/router";
import {
  TranscriptFragmentFragment,
  useDocumentQuery,
  useDocumentsQuery,
  useGetUserDocumentQuery,
  useGetUserFromScheduleQuery,
  User,
  UserFragmentFragment,
  useUpdateDocumentMutation,
} from "../../generated/graphql";

interface DetailProps {}

interface InfoContainerProps {
  size: string;
  content: string;
  position?: boolean;
  type?: string;
  id?: number;
  scheduleId?: number;
  transcriptId?: number;
}

const InfoContainer: React.FC<InfoContainerProps> = ({
  children,
  size,
  content,
  type,
  id,
  scheduleId,
  transcriptId,
}) => {
  const [text, setText] = useState(content);
  const [edit, setEdit] = useState(false);
  const [, update] = useUpdateDocumentMutation();

  useEffect(() => {
    setText(content);
  }, [content]);

  return (
    <div className={style.edit}>
      {!edit ? (
        <div> {text === "" ? "chưa có" : text}</div>
      ) : (
        <form
          className={style.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            autoComplete="off"
            type={
              type
                ? type === "title" ||
                  type === "company" ||
                  type === "description" ||
                  type === "transcript"
                  ? "text"
                  : "time"
                : null
            }
            name="time"
            onChange={({ target: { value } }) => setText(value)}
            placeholder="Chỉnh sửa"
            value={text}
          />
        </form>
      )}

      {type ? (
        <>
          {!edit ? (
            <div style={{ width: size }} className={`${style.icon}`}>
              <EditIcon
                onClick={() => setEdit(true)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                console.log(type);
                if (type === "title") {
                  update({
                    options: {
                      id,
                      title: text,
                    },
                  });
                } else if (type === "company") {
                  update({
                    options: {
                      id,
                      scheduleId,
                      company: text,
                    },
                  });
                } else if (type === "description") {
                  update({
                    options: {
                      id,
                      scheduleId,
                      description: text,
                    },
                  });
                } else if (type === "transcript") {
                  update({
                    options: {
                      id,
                      transcripts: {
                        id: transcriptId,
                        context: text,
                      },
                    },
                  });
                }
                setEdit(false);
              }}
              className={style.button}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

const Detail: React.FC<DetailProps> = ({}) => {
  const renderTime = (time: number) => {
    return time > 9 ? time : "0" + time;
  };

  const [search, setSearch] = useState("");

  const msToTime = (input: number, hrs: number, mins: number, sec: number) => {
    const time = input / 1000 + hrs * 3600 + mins * 60 + sec;
    let hours = Math.floor(time / (60 * 60));

    let divisor_for_minutes = time % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    // setTimeout(() => {
    //   setTime(() => meetingStatedTime.valueOf() - new Date().valueOf());
    // }, 1000);

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const router = useRouter();

  const [{ data }] = useDocumentQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

  const [users] = useGetUserDocumentQuery({
    variables: {
      options: {
        absents: data?.document?.document?.absents
          .split("-")
          .map((value) => parseInt(value))
          .filter((value) => !isNaN(value)),
        members: data?.document?.document?.members
          .split("-")
          .map((value) => parseInt(value))
          .filter((value) => !isNaN(value)),
      },
    },
  });

  const userTextString = (
    transcripts: TranscriptFragmentFragment[]
  ): Record<number, number> => {
    const userMap: Record<number, number> = {};
    console.log("-------------------------------------------------------");
    console.log(transcripts);
    transcripts.forEach(({ context, userId }) => {
      if (userMap[userId]) {
        userMap[userId] = userMap[userId] + context.split(" ").length;
      } else {
        userMap[userId] = context.split(" ").length;
      }
      console.log(context, context.split(" ").length);
    });
    return userMap;
  };

  const [duration, setDuration] = useState<number>(
    data?.document?.document?.duration
  );
  const [timeStartState, setTimeStartState] = useState<string>(
    data?.document?.document?.startedAt
  );

  useEffect(() => {
    if (data?.document) {
      setDuration(data?.document?.document?.duration);
      setTimeStartState(data?.document?.document?.startedAt);
    }
  }, [data?.document]);

  const isTimeZoneSearch = (timezone: string) => {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
      timezone
    );

    return isValid;
  };

  if (!data?.document && !timeStartState && !duration) return <div></div>;

  return (
    <div className={style.container}>
      <div className={style.input}>
        <input
          value={search}
          placeholder="Tìm kiếm từ khóa nội dung cuộc họp"
          onChange={({ target: { value } }) => {
            setSearch(value);
          }}
        />
        <div className={style.icon}>
          <SearchIcon />
        </div>
      </div>
      <div className={style.grid}>
        <div className={style.transcript}>
          <div className={style.transcript_title}>Nội dung</div>
          <ul className={style.transcript_list}>
            {data.document.document.transcripts
              .sort((a, b) => {
                return a.startedAt - b.startedAt;
              })
              .filter((content) => {
                const arr = search.split(" - ");
                if (search === content.user.fullname) return true;
                else if (arr.length === 2) {
                  if (isTimeZoneSearch(arr[0]) && isTimeZoneSearch(arr[1])) {
                    const splitTime = arr[0]
                      .split(":")
                      .map((value) => parseInt(value));
                    const startTime =
                      data?.document?.document?.startedAt.split(" ");
                    const time = msToTime(
                      content.startedAt,
                      parseInt(startTime[0]),
                      parseInt(startTime[1]),
                      parseInt(startTime[2])
                    );
                    const tmp = time.split(":").map((value) => parseInt(value));
                    const minus =
                      (tmp[0] - splitTime[0]) * 3600 +
                      (tmp[1] - splitTime[1]) * 60 +
                      tmp[2] -
                      splitTime[2];

                    if (minus > 0 && minus * 1000 < duration) {
                      return true;
                    } else return false;
                  }
                } else if (content.context.includes(search)) return true;
                return false;
              })
              .map(
                (
                  {
                    id,
                    context,
                    type,
                    userId,
                    startedAt,
                    user: { avatar, fullname },
                  },
                  index
                ) => {
                  const startTime =
                    data?.document?.document?.startedAt.split(" ");
                  const time = msToTime(
                    startedAt,
                    parseInt(startTime[0]),
                    parseInt(startTime[1]),
                    parseInt(startTime[2])
                  );

                  return (
                    <li key={index} className={style.transcript_list_detail}>
                      <div className={style.transcript_list_detail_avatar}>
                        <img src={avatar} alt="" />
                      </div>
                      <div className={style.transcript_list_detail_info}>
                        <div
                          className={style.transcript_list_detail_info_username}
                        >
                          {fullname}
                        </div>

                        <div className={style.transcript_list_detail_info_time}>
                          {/* {msToTime(start)} */}
                          {time}
                        </div>
                        <div
                          style={{
                            // color:
                            //   start / 1000 <= currentTime &&
                            //   end / 1000 >= currentTime
                            //     ? "#1da1f2"
                            //     : "#000",
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
                              <InfoContainer
                                size={"2rem"}
                                content={context}
                                position={true}
                                id={data.document.document.id}
                                transcriptId={id}
                                type="transcript"
                              />
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

        <div className={style.graph}>
          <div className={style.graph_title}></div>
          <Pie
            options={{
              title: {
                display: true,
                text: "Sơ đồ thống kê số từ các thành viên nói",
                fontSize: 20,
              },
              legend: {
                display: true,
              },
            }}
            data={{
              datasets: [
                {
                  data: (() => {
                    const transcriptMap = userTextString(
                      data.document.document.transcripts
                        .sort((a, b) => {
                          return a.startedAt - b.startedAt;
                        })
                        .filter((content) => {
                          const arr = search.split(" - ");
                          if (search === content.user.fullname) return true;
                          else if (arr.length === 2) {
                            if (
                              isTimeZoneSearch(arr[0]) &&
                              isTimeZoneSearch(arr[1])
                            ) {
                              console.log(arr);
                              const splitTime = arr[0]
                                .split(":")
                                .map((value) => parseInt(value));
                              const startTime =
                                data?.document?.document?.startedAt.split(" ");
                              const time = msToTime(
                                content.startedAt,
                                parseInt(startTime[0]),
                                parseInt(startTime[1]),
                                parseInt(startTime[2])
                              );
                              const tmp = time
                                .split(":")
                                .map((value) => parseInt(value));
                              const minus =
                                (tmp[0] - splitTime[0]) * 3600 +
                                (tmp[1] - splitTime[1]) * 60 +
                                tmp[2] -
                                splitTime[2];

                              if (minus > 0 && minus * 1000 < duration) {
                                return true;
                              } else return false;
                            }
                          } else if (content.context.includes(search))
                            return true;
                          return false;
                        })
                    );
                    return users.data?.getUserDocument.map(
                      ({ user: { id, fullname } }) => {
                        if (
                          users.data?.getUserDocument.find(
                            ({ user: { fullname } }) => fullname === search
                          )
                        ) {
                          if (fullname === search && transcriptMap[id])
                            return transcriptMap[id];
                          else return 0;
                        }
                        if (transcriptMap[id]) return transcriptMap[id];
                        else return 0;
                      }
                    );
                  })(),
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
              // the legend and in the tooltips when hovering different arcsThese labels appear in
              labels: users.data?.getUserDocument.map(
                ({ user: { fullname } }) => {
                  return fullname;
                }
              ),
            }}
            onElementsClick={(e) => {
              if (e[0]?._model) {
                if (search === e[0]._model.label) setSearch("");
                else setSearch(e[0]._model.label);

                setDuration(data?.document.document.duration);
                setTimeStartState(data?.document.document.startedAt);
              }
            }}
            width={300}
            height={200}
          />

          <div
            className={style.graph_title}
            style={{ marginTop: "4rem" }}
          ></div>
          <Line
            options={{
              title: {
                display: true,
                text: `Sơ đồ thời điểm người dùng nói`,
                fontSize: 20,
              },
              legend: {
                display: true,
              },
            }}
            data={{
              labels: Array.from({ length: 10 }, (_, index) => {
                const step = Math.floor(duration / 10);
                const startTime = timeStartState
                  ? timeStartState.split(" ")
                  : data?.document?.document?.startedAt;

                const time = msToTime(
                  index * step,
                  parseInt(startTime[0]),
                  parseInt(startTime[1]),
                  parseInt(startTime[2])
                );
                return time;
              }).map((i) => {
                return i;
              }),
              datasets: [
                {
                  label: "Nội dung",
                  fill: false,
                  lineTension: 0.5,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                  ],
                  borderColor: "#1da1f2",
                  borderWidth: 2,
                  data: Array.from({ length: 10 }, (_, index) => {
                    const step = Math.floor(duration / 10);
                    const startTime = timeStartState
                      ? timeStartState.split(" ")
                      : data?.document?.document?.startedAt.split(" ");
                    const time = msToTime(
                      index * step,
                      parseInt(startTime[0]),
                      parseInt(startTime[1]),
                      parseInt(startTime[2])
                    );
                    return { time, step };
                  }).map(({ time, step }) => {
                    const splitTime = time
                      .split(":")
                      .map((value) => parseInt(value));
                    let count = 0;
                    data.document.document.transcripts
                      .sort((a, b) => {
                        return a.startedAt - b.startedAt;
                      })
                      .filter((content) => {
                        const arr = search.split(" - ");
                        if (search === content.user.fullname) return true;
                        else if (arr.length === 2) {
                          if (
                            isTimeZoneSearch(arr[0]) &&
                            isTimeZoneSearch(arr[1])
                          ) {
                            const splitTime = arr[0]
                              .split(":")
                              .map((value) => parseInt(value));
                            const startTime =
                              data?.document?.document?.startedAt.split(" ");
                            const time = msToTime(
                              content.startedAt,
                              parseInt(startTime[0]),
                              parseInt(startTime[1]),
                              parseInt(startTime[2])
                            );
                            const tmp = time
                              .split(":")
                              .map((value) => parseInt(value));
                            const minus =
                              (tmp[0] - splitTime[0]) * 3600 +
                              (tmp[1] - splitTime[1]) * 60 +
                              tmp[2] -
                              splitTime[2];

                            if (minus > 0 && minus * 1000 < duration) {
                              return true;
                            } else return false;
                          }
                        } else if (content.context.includes(search))
                          return true;
                        return false;
                      })
                      .map(({ startedAt }) => {
                        const startTime =
                          data?.document?.document?.startedAt.split(" ");
                        const tmp = msToTime(
                          startedAt,
                          parseInt(startTime[0]),
                          parseInt(startTime[1]),
                          parseInt(startTime[2])
                        )
                          .split(":")
                          .map((value) => parseInt(value));

                        const minus =
                          (tmp[0] - splitTime[0]) * 3600 +
                          (tmp[1] - splitTime[1]) * 60 +
                          tmp[2] -
                          splitTime[2];

                        if (minus * 1000 < step && minus >= 0) {
                          count++;
                        }
                      });
                    return count;
                  }),
                },
              ],
            }}
            onElementsClick={(e) => {
              if (e[0]) {
                const step = Math.floor(duration / 10);
                const time = e[0]._xScale.ticks[e[0]._index];
                const startedTime = `${time.split(":")[0]} ${
                  time.split(":")[1]
                } ${time.split(":")[2]}`;
                const splitTime = startedTime.split(" ");

                const endedTime = msToTime(
                  step,
                  parseInt(splitTime[0]),
                  parseInt(splitTime[1]),
                  parseInt(splitTime[2])
                );
                setSearch(`${time} - ${endedTime}`);
                setTimeStartState(startedTime);
                setDuration(step);
                // setDuration( Math.floor(duration / 10));
              }
            }}
            width={300}
            height={200}
          />
          {duration !== data?.document?.document.duration ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "#1da1f2",
                  color: "#fff",
                  fontSize: "1.5rem",
                  padding: "1.2rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setDuration(data?.document?.document.duration);
                  setTimeStartState(data?.document?.document.startedAt);
                  setSearch("");
                }}
              >
                Quay lại
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Detail;
