import React, { useContext, useEffect, useRef, useState } from "react";
import style from "../../styles/module/assistance.module.scss";
import lottie from "lottie-web";

import RecordingIcon from "../../../public/icon/recording.svg";
import PauseIcon from "../../../public/icon/pause.svg";
import StopIcon from "../../../public/icon/stop.svg";
import PlayIcon from "../../../public/icon/play.svg";
import PreviewIcon from "../../../public/icon/preview.svg";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  useCreateNotificationMutation,
  useGetScheduleQuery,
  useMeQuery,
  useSaveDocumentMutation,
  useUpdateInfoMutation,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { ChatInfoProps, UserProps } from "../../pages/meet/[id]";

interface AssistanceProps {
  chats: ChatInfoProps[];
  socket: any;
  setRecord: React.Dispatch<React.SetStateAction<string>>;
  meetingStartedTime?: Date;
  members: UserProps[];
}

const Assistance: React.FC<AssistanceProps> = ({
  chats,
  socket,
  setRecord,
  meetingStartedTime,
  members,
}) => {
  const animated = useRef<any>(null);
  const background = useRef<any>(null);
  const rotate = useRef<any>(null);
  const leaf = useRef<any>(null);
  const assistance = useRef<any>(null);

  const [recordState, setRecordState] = useState("record");
  const [text, setText] = useState("Xin chào, tôi sẽ hỗ trợ bạn");

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    pauseRecording,
    resumeRecording,
    clearBlobUrl,
  } = useReactMediaRecorder({ video: true });

  const [time, setTime] = useState(0);

  const [url, setUrl] = useState("");
  const [, createNotification] = useCreateNotificationMutation();

  useEffect(() => {
    socket.on("receive url", (url: any) => {
      setUrl(url);
      setRecord("success");
    });
  }, []);

  useEffect(() => {
    if (mediaBlobUrl) {
      fetch(mediaBlobUrl)
        .then((res) => res.blob()) // Gets the response and returns it as a blob
        .then(async (blob) => {
          console.log(blob.size);
          if (blob.size <= 5e8) {
            socket.emit("upload", blob);
          } else {
            setRecord("error");
            setRecordState("");
          }
        });
    }

    // return () => {
    //   clearBlobUrl();
    // };
  }, [mediaBlobUrl]);

  useEffect(() => {
    socket.emit("text-to-speech", text);
  }, [text]);

  useEffect(() => {
    if (recordState === "recording") {
      setTimeout(() => {
        setTime(time + 1);
      }, 1000);
    }
  }, [time, recordState]);

  const getTimeRender = (time: number) => {
    let hours = Math.floor(time / (60 * 60));

    let divisor_for_minutes = time % (60 * 60);
    let minutes = hours * 60 + Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const router = useRouter();
  const [schedule] = useGetScheduleQuery({
    variables: {
      id: parseInt(router.query.scheduleId as string),
    },
  });
  const [myInfo] = useMeQuery();
  const [, saveDocument] = useSaveDocumentMutation();
  const [recordStartedAt, setRecordStartedAt] = useState<Date>();

  const [, updateUser] = useUpdateInfoMutation();

  useEffect(() => {
    lottie.loadAnimation({
      container: animated.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/60937-card-speaking.json"),
    });
    lottie.loadAnimation({
      container: background.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/48941-background-floting.json"),
    });
    lottie.loadAnimation({
      container: rotate.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/16474-wind-turbine-spinning-in-the-background.json"),
    });
    lottie.loadAnimation({
      container: leaf.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/38826-leafs-blow.json"),
    });
    lottie.loadAnimation({
      container: assistance.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/6778-siri-style-loading.json"),
    });

    socket.on("send audio", (audio: Uint8Array) => {
      const blob = new Blob([new Uint8Array(audio).buffer], {
        type: "audio/mp3",
      });
      var blobURL = window.URL.createObjectURL(blob);
      var audio0 = new Audio(blobURL);
      audio0.play();

      // const blob = new Blob([audio], { type: "audio/wav" });
      // const url = window.URL.createObjectURL(blob);
      // console.log(url);
    });
  }, []);

  return (
    <div className={style.container}>
      <div className={style.avatar}>
        <div className={style.image}>
          {/* <svg viewBox="0 0 500 500">
            <path
              id="curve"
              d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
            />
            <text width="500">
              <textPath>Dangerous Curves Ahead</textPath>
            </text>
          </svg> */}
          <img
            src={
              "https://vignette.wikia.nocookie.net/25072768-9cd1-4a16-bb26-c12bb18693e7/scale-to-width-down/1200"
            }
            alt=""
          />
        </div>
        <div ref={animated} className={style.lottie}></div>
        <div
          ref={leaf}
          className={style.lottie}
          style={{ position: "absolute", top: 0, left: 0, width: "70%" }}
        ></div>
        <div
          ref={background}
          className={style.lottie}
          style={{ position: "absolute", top: 0, right: 0 }}
        ></div>
        <div
          ref={rotate}
          className={style.lottie}
          style={{ position: "absolute", top: 0, right: 0, width: "70%" }}
        ></div>
      </div>
      <div className={style.content}>
        {myInfo?.data?.me &&
        schedule?.data?.getSchedule &&
        myInfo?.data?.me?.id ===
          schedule?.data?.getSchedule?.schedule?.host?.id ? (
          <>
            <div className={style.timer}>{getTimeRender(time)}</div>
            <div
              className={style.generate}
              onClick={async () => {
                try {
                  await updateUser({
                    document: myInfo?.data?.me?.document + 1,
                  });
                  const list_members = members
                    .map(({ id }) => id)
                    .filter((id) => id !== -1);
                  const absents = schedule?.data?.getSchedule?.users
                    .filter(({ id }) => {
                      return !list_members.find((member) => id === member);
                    })
                    .map(({ id }) => id);
                  saveDocument({
                    options: {
                      logo: schedule.data.getSchedule.schedule.banner,
                      title: schedule.data.getSchedule.schedule.title,
                      members: list_members,
                      absents: absents,
                      duration:
                        new Date().valueOf() - meetingStartedTime.valueOf(),
                      recordStartedAt: recordStartedAt
                        ? recordStartedAt.valueOf() -
                          meetingStartedTime.valueOf()
                        : 0,
                      startedAt:
                        meetingStartedTime.getHours() +
                        " " +
                        meetingStartedTime.getMinutes() +
                        " " +
                        meetingStartedTime.getSeconds(),
                      record: url,
                      scheduleId: schedule.data.getSchedule.schedule.id,
                      transcripts: chats
                        .filter(({ userId }) => userId !== -1)
                        .map(({ userId, content, type, time }) => {
                          return {
                            context: content,
                            type,
                            userId: userId,
                            startedAt:
                              new Date(time).valueOf() -
                              meetingStartedTime.valueOf(),
                          };
                        }),
                    },
                  }).then(async (result) => {
                    console.log(result?.data);
                    await Promise.all(
                      schedule.data.getSchedule.users.map(async ({ id }) => {
                        const notification = await createNotification({
                          content: `đã tạo biên bản "${schedule.data?.getSchedule.schedule.title}" cho cuộc họp`,
                          url: `/document/${result?.data?.saveDocument}`,
                          receiver: id,
                          type: "document",
                          isSeen: false,
                        });

                        // console.log(notification.data.createNotification);
                        socket.emit(
                          "send notification",
                          notification?.data?.createNotification
                        );
                        // socket.emit("send notification", { receiver: id });
                      })
                    );
                  });

                  setRecord("success document");
                } catch (err) {
                  console.log(err);
                  setRecord("error document");
                }
              }}
            >
              {"Tạo biên bản"}
            </div>
          </>
        ) : null}
        <div className={style.assistance}>
          <div ref={assistance} className={style.lottie}></div>

          <div className={style.text}>{text}</div>
        </div>
        {myInfo?.data?.me &&
        schedule?.data?.getSchedule &&
        myInfo?.data?.me?.id ===
          schedule?.data?.getSchedule?.schedule?.host?.id ? (
          <div className={style.util}>
            <div className={style.icon_list}>
              {recordState === "recording" || recordState === "resume" ? (
                <div
                  className={style.stop_icon}
                  onClick={() => {
                    setRecordState("record");
                    setText(
                      "Chúc mừng bạn có thể xem trước đoạn video được ghi lại và tạo biên bản cho cuộc họp"
                    );
                    setRecord("loading");
                    stopRecording();
                  }}
                >
                  <StopIcon />
                </div>
              ) : null}
              <div
                className={style.record_icon}
                onClick={() => {
                  let state = "recording";

                  if (recordState === "record") {
                    state = "recording";
                    startRecording();
                    clearBlobUrl();
                    setTime(0);
                    setRecordStartedAt(new Date());
                    setText("Bạn đang quay lại nội dung cuộc họp");
                  } else if (recordState === "recording") {
                    state = "resume";
                    setText("Bạn dừng quay");
                    pauseRecording();
                  } else if (recordState === "resume") {
                    state = "recording";
                    resumeRecording();
                    setText("Quay lại");
                  }
                  setRecordState(state);
                }}
              >
                {recordState === "record" ? (
                  <RecordingIcon />
                ) : recordState === "recording" ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}

                {/* <p>Quay</p> */}
              </div>
              {url !== "" ? (
                <a href={url} target="_blank">
                  <div className={style.preview_icon}>
                    <PreviewIcon />
                    <p>Xem recording</p>
                  </div>
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Assistance;
