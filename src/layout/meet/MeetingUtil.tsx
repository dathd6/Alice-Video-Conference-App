import React, { useState } from "react";
import PhoneIcon from "../../../public/icon/phone.svg";
// import RecordIcon from "../../../public/icon/record.svg";
// import UserIcon from "../../../public/icon/user.svg";
// import ChatIcon from "../../../public/icon/chat.svg";
// import SettingIcon from "../../../public/icon/setting.svg";

import ShareScreenIcon from "../../../public/icon/screen-share.svg";
import StopShareScreenIcon from "../../../public/icon/stop-screen-share.svg";

import AudioIcon from "../../../public/icon/volumn.svg";
import MuteIcon from "../../../public/icon/volumn_mute.svg";

import {
  useGetScheduleQuery,
  useMeQuery,
  useSaveDocumentMutation,
  useUpdateInfoMutation,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { ChatInfoProps } from "../../pages/meet/[id]";

interface MeetingUtilProps {
  myVideoTracks: MediaStream;
  setIsMute: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShare: React.Dispatch<React.SetStateAction<boolean>>;
  isMute: boolean;
  isShare: boolean;

  joinFlag: boolean;
  setJoinFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RenderButtonProps {
  active?: boolean;
}

const MeetingUtil: React.FC<MeetingUtilProps> = ({
  myVideoTracks,
  isMute,
  isShare,
  setIsShare,
  setIsMute,
  joinFlag,
  setJoinFlag,
}) => {
  // console.log(myVideoTracks);

  const RenderButton: React.FC<RenderButtonProps> = ({ children, active }) => {
    return <div className="meet_util_container_bottom_button">{children}</div>;
  };

  const router = useRouter();

  const [schedule] = useGetScheduleQuery({
    variables: {
      id: parseInt(router.query.scheduleId as string),
    },
  });

  const [myInfo] = useMeQuery();

  const [, update] = useUpdateInfoMutation();

  return (
    <div className="meet_util">
      <div className="meet_util_container">
        <div className="meet_util_container_header">
          <img src="/icon/Alice_v1.png" alt="" />
          <span>Alice</span>
        </div>
        <div className="meet_util_container_bottom">
          <div
            className="speacial_blur"
            onClick={() => {
              // try {
              //   if (isMute) {
              //     navigator.mediaDevices
              //       .getUserMedia({ video, audio: true })
              //       .then(async (stream: MediaStream) => {
              //         myVideo.current.srcObject = stream;
              //         setMyVideoTracks(stream);
              //         setAudio(true);
              //         setIsMute(false);
              //       });
              //   } else {
              //     if (!video) {
              //       setAudio(false);
              //       setMyVideoTracks(null);
              //       myVideo.current.srcObject = null;
              //       setIsMute(true);
              //     } else
              //       navigator.mediaDevices
              //         .getUserMedia({ video, audio: false })
              //         .then(async (stream: MediaStream) => {
              //           myVideo.current.srcObject = stream;
              //           setMyVideoTracks(stream);
              //           setAudio(false);
              //           setIsMute(true);
              //         });
              //   }
              // } catch (err) {}
              myVideoTracks.getAudioTracks().map((tracks) => {
                tracks.enabled = !tracks.enabled;
              });
              setIsMute(!isMute);
            }}
          >
            <RenderButton>{isMute ? <MuteIcon /> : <AudioIcon />}</RenderButton>
          </div>

          <a
            className="meet_util_container_bottom_phone"
            onClick={async () => {
              try {
                myVideoTracks.getTracks().forEach((track: MediaStreamTrack) => {
                  track.stop();
                });
              } catch (err) {}
              if (
                schedule?.data &&
                myInfo?.data?.me?.id ===
                  schedule?.data?.getSchedule?.schedule?.host?.id
              ) {
                router.push("/document");
              }
              router.push("/");
            }}
          >
            <PhoneIcon />
          </a>

          <div
            className="speacial_blur"
            onClick={() => {
              // if (!audio) {
              //   setVideo(false);
              //   setMyVideoTracks(null);
              //   myVideo.current.srcObject = null;
              //   setIsShare(false);
              // } else
              //   navigator.mediaDevices
              //     .getUserMedia({ video: false, audio })
              //     .then(async (stream: MediaStream) => {
              //       myVideo.current.srcObject = stream;
              //       setMyVideoTracks(stream);
              //       setVideo(false);
              //       setIsShare(false);
              //     });
              myVideoTracks.getVideoTracks().map((tracks) => {
                tracks.enabled = !tracks.enabled;
              });
              setIsShare(!isShare);
              // navigator.mediaDevices
              //   .getUserMedia({ video: true, audio })
              //   .then(async (stream: MediaStream) => {
              //     myVideo.current.srcObject = stream;
              //     setMyVideoTracks(stream);
              //     setVideo(true);
              //     setIsShare(true);
              //   });
            }}
          >
            <RenderButton>
              {isShare ? <ShareScreenIcon /> : <StopShareScreenIcon />}
            </RenderButton>
          </div>
          {!joinFlag ? (
            <div
              style={{
                backgroundColor: "#1da1f2",
                color: "#fff",
                padding: "1rem 2rem",
                fontSize: "2rem",
                marginLeft: "2rem",
                borderRadius: "1rem",
              }}
              className={""}
              onClick={() => setJoinFlag(true)}
            >
              Kết nối
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MeetingUtil;
