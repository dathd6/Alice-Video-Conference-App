import React, { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import styled from "styled-components";
import lottie from "lottie-web";

import style from "../../styles/module/meet_sidebar.module.scss";
import MeetingScreen from "../../layout/meet/MeetingScreen";
import MeetingUtil from "../../layout/meet/MeetingUtil";
import { downsampleBuffer } from "../../utils/downsampleBuffer";
import router, { useRouter } from "next/router";
import Chat from "../../components/meet/Chat";
import Member from "../../components/meet/Member";

import SettingIcon from "../../../public/icon/setting.svg";
import {
  useGetScheduleQuery,
  useMeQuery,
  UserFragmentFragment,
  useUpdateInfoMutation,
} from "../../generated/graphql";
import FormCenter from "../../components/card/FormCenter";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import Assistance from "../../components/meet/Assistance";
import InviteMember from "../../components/meet/InviteMember";
import MeetingAuthenForm from "../../components/meet/MeetingAuthenForm";
import { Context } from "../_app";
import { ContextType } from "../../static/types";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately

interface MeetingProps {}

export interface ChatInfoProps {
  username: string;
  avatar: string;
  content?: string;
  type?: string;
  time: Date;
  userId?: number;
  color?: string;
}

export interface UserProps extends UserFragmentFragment {
  socketId?: string;
  host?: boolean;
  color?: string;
}

const ENDPOINT = process.env.NEXT_PUBLIC_SIGNALING_SERVER as string;
let bufferSize = 2048,
  context: any,
  processor: any,
  input: any;

// @ts-ignore
const socket = socketIOClient(ENDPOINT, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "share",
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

const Meeting: React.FC<MeetingProps> = ({}) => {
  const roomID = useRouter().query;
  const [openMenu, setOpenMenu] = useState(false);
  const [navbar, setNavbar] = useState(0);
  const [onFiles, setOnFiles] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [config, setConfig] = useState(true);
  const [invite, setInvite] = useState(false);

  const { setIsMeetingAuth } = useContext(Context) as ContextType;

  const [myInfo] = useMeQuery();
  const [schedule] = useGetScheduleQuery({
    variables: {
      id: parseInt(useRouter().query.scheduleId as string),
    },
  });
  const [, update] = useUpdateInfoMutation();
  const myVideo = useRef<any>();
  const [myPeer, setMyPeer] = useState<any>();
  const myPeerRef = useRef<any>();

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      let peer: any;
      if (process.env.NODE_ENV === "development") {
        console.log(process.env.NODE_ENV);
        peer = new Peer(socket.id, {
          config: {
            iceServers: [
              // { urls: "stun:ss-turn2.xirsys.com" },
              // {
              //   urls: [
              //     "turn:ss-turn2.xirsys.com:80?transport=udp",
              //     "turn:ss-turn2.xirsys.com:3478?transport=udp",
              //     "turn:ss-turn2.xirsys.com:80?transport=tcp",
              //     "turn:ss-turn2.xirsys.com:3478?transport=tcp",
              //     "turns:ss-turn2.xirsys.com:443?transport=tcp",
              //     "turns:ss-turn2.xirsys.com:5349?transport=tcp",
              //   ],
              //   username:
              //     "-LyASwckfs6fjRNfyMVBNAeCI1c_2KXhxzYucQI4TAGwtSJxOle_3BcKU7mTNJwrAAAAAGDkhGZoZGRob2FuZ2R1Y2RhdA==",
              //   credential: "08459da4-de77-11eb-aefc-0242ac140004",
              // },
              {
                urls: ["stun:ss-turn2.xirsys.com"],
              },
              {
                username:
                  "MQoxsFljrNP3Pzsdskp2HO_ylJ3pImn-IxXHj_t9_kvj99GuRt89MNBKKO2HTMwnAAAAAGDpjklhbmhkdWNob2FuZw==",
                credential: "dd7edc30-e177-11eb-a28c-0242ac140004",
                urls: [
                  "turn:ss-turn2.xirsys.com:80?transport=udp",
                  "turn:ss-turn2.xirsys.com:3478?transport=udp",
                  "turn:ss-turn2.xirsys.com:80?transport=tcp",
                  "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                  "turns:ss-turn2.xirsys.com:443?transport=tcp",
                  "turns:ss-turn2.xirsys.com:5349?transport=tcp",
                ],
              },
              { urls: "stun:numb.viagenie.ca" },
              {
                urls: "turn:numb.viagenie.ca",
                credential: "83400319a",
                username: "theprogamevn@gmail.com",
              },
            ],
          },
        });
      } else {
        console.log(process.env.NODE_ENV);
        peer = new Peer(socket.id, {
          key: "peerjs",
          host: "alice-peer-server.herokuapp.com",
          secure: true,
          port: 443,
          path: "/",
          debug: 3,
          config: {
            iceServers: [
              {
                urls: ["stun:ss-turn2.xirsys.com"],
              },
              {
                username:
                  "MQoxsFljrNP3Pzsdskp2HO_ylJ3pImn-IxXHj_t9_kvj99GuRt89MNBKKO2HTMwnAAAAAGDpjklhbmhkdWNob2FuZw==",
                credential: "dd7edc30-e177-11eb-a28c-0242ac140004",
                urls: [
                  "turn:ss-turn2.xirsys.com:80?transport=udp",
                  "turn:ss-turn2.xirsys.com:3478?transport=udp",
                  "turn:ss-turn2.xirsys.com:80?transport=tcp",
                  "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                  "turns:ss-turn2.xirsys.com:443?transport=tcp",
                  "turns:ss-turn2.xirsys.com:5349?transport=tcp",
                ],
              },
              { urls: "stun:numb.viagenie.ca" },
              {
                urls: "turn:numb.viagenie.ca",
                credential: "83400319a",
                username: "theprogamevn@gmail.com",
              },
            ],
          },
        });
      }

      // peer.connect(id, )
      myPeerRef.current = peer;
      setMyPeer(peer);
      peer.on("call", (call) => {
        call.answer(myVideo.current.srcObject);
        setConnections((arr) => [...arr, call]);
      });
    });
  }, []);

  const [record, setRecord] = useState("");
  const loading = useRef<any>(null);
  const success = useRef<any>(null);
  const error = useRef<any>(null);
  const successDocument = useRef<any>(null);

  useEffect(() => {
    if (record === "loading") {
      lottie.destroy("success");
      lottie.destroy("error");
      lottie.destroy("success document");
      lottie.loadAnimation({
        name: "loading",
        container: loading.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../public/json/64193-construction.json"),
      });
    } else if (record === "success") {
      lottie.destroy("error");
      lottie.destroy("loading");
      lottie.destroy("success document");

      lottie.loadAnimation({
        name: "success",
        container: success.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../public/json/3152-star-success.json"),
      });
      setTimeout(() => {
        setRecord("");
      }, 4000);
    } else if (record === "success document") {
      lottie.destroy("error");
      lottie.destroy("loading");
      lottie.destroy("success");
      lottie.loadAnimation({
        name: "success",
        container: successDocument.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../public/json/61885-post.json"),
      });
      setTimeout(() => {
        setRecord("");
      }, 4000);
    } else if (record === "error" || record === "error document") {
      lottie.destroy("loading");
      lottie.destroy("success document");
      lottie.destroy("success");
      lottie.loadAnimation({
        name: "error",
        container: error.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../public/json/54613-error-404.json"),
      });
      setTimeout(() => {
        setRecord("");
      }, 4000);
    }
  }, [record]);

  const [me, setMe] = useState<undefined | UserProps>();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (myInfo?.data?.me) {
      if (!flag) {
        setMe(myInfo.data.me);
        update({ joined: myInfo.data.me.joined + 1 });
        setFlag(true);
      }
    }
  }, [myInfo?.data?.me?.id]);

  const [myVideoTracks, setMyVideoTracks] = useState<MediaStream>();
  const [isMute, setIsMute] = useState(false);
  const [isShare, setIsShare] = useState(true);
  const [members, setMembers] = useState<Array<UserProps>>([]);
  const [isPassword, setIsPassword] = useState<string>("");
  const [chats, setChats] = useState<ChatInfoProps[]>([]);
  const [speechApiFlag, setSpeechApiFlag] = useState(false);
  const [meetingStartedTime, setMeetingStartedTime] = useState<Date>(
    new Date()
  );
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (isPassword !== "" && me) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then(async (stream: MediaStream) => {
          myVideo.current.srcObject = stream;
          setMyVideoTracks(stream);

          socket.on("on mute", () => {
            setIsMute((isMute) => {
              if (!isMute) {
                socket.emit("text-to-speech", `Chủ phòng đã mute bạn`);
                //@ts-ignore
                stream.getAudioTracks().map((tracks) => {
                  tracks.enabled = !tracks.enabled;
                });
              }
              return true;
            });
          });

          socket.on("on unshare", () => {
            setIsShare((isShare) => {
              if (isShare) {
                socket.emit(
                  "text-to-speech",
                  `Chủ phòng đã chặn chia sẻ camera của bạn`
                );

                stream.getVideoTracks().map((tracks) => {
                  tracks.enabled = !tracks.enabled;
                });
              }
              return false;
            });
          });
          socket.on("to all users", (user: any, peerId: string) => {
            // console.log(user, members);
            try {
              const conn = myPeerRef.current.call(peerId, stream);

              setConnections((arr) => [...arr, conn]);
            } catch (err) {
              console.log(err);
            }
            // const conn = myPeer.current.call(peerId, myVideo.current.srcObject);
            // setConnections((arr) => [...arr, conn]);
            setMembers((members) => {
              return [...members, user];
            });
          });
          socket.on("get all users", (users: any, chats: any, date: any) => {
            setMembers(users);
            setChats(chats);
            setMeetingStartedTime(new Date(date));

            setSpeechApiFlag(true);
          });

          socket.on("user out", (peerId: any, id: any) => {
            setMembers((members) => {
              return members.filter(({ socketId }) => socketId !== id);
            });
            setConnections((conn) =>
              conn.filter(({ peer }) => peerId !== peer)
            );

            // setPeers((peers) => peers.filter(({ peerID }) => peerID !== id));
          });

          socket.on("user edit chat", (id: Number, text: string) => {
            setChats((chats) => {
              return chats.map((chat, index) => {
                if (index === id) {
                  return { ...chat, content: text };
                }
                return chat;
              });
            });
          });

          socket.on("on kick", () => {
            try {
              myVideoTracks.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
              });
            } catch (err) {}

            router.push("/");
          });

          socket.on("user delete chat", (id: Number) => {
            setChats((chats) => {
              return chats.filter((_, index) => {
                return index !== id;
              });
            });
          });

          socket.on("data", (result: any, user: any) => {
            if (user) {
              setMe((me) => {
                // console.log(me?.id);
                // console.log(user.id);
                // console.log(schedule?.data?.getSchedule?.schedule?.host?.id);
                if (
                  me?.id !== -1 &&
                  me?.id === user.id &&
                  schedule?.data?.getSchedule?.schedule?.host?.id === me?.id
                ) {
                  if (result.data.toLowerCase().includes("thoát phòng số ")) {
                    const arr = result.data
                      .toLowerCase()
                      .split("thoát phòng số ");
                    if (arr.length > 1) {
                      const thanhvien = arr[1].split(" ")[0];

                      if (!isNaN(thanhvien)) {
                        setMembers((members) => {
                          members.map((user, i) => {
                            if (i === parseInt(thanhvien) - 1) {
                              socket.emit(
                                "text-to-speech",
                                `Bạn đã kick bạn ${user.fullname}`
                              );
                              socket.emit("kick user", user.socketId);
                            }
                          });
                          return members;
                        });
                      }
                    }
                  } else if (result.data.toLowerCase().includes("tắt âm số ")) {
                    const arr = result.data.toLowerCase().split("tắt âm số ");
                    if (arr.length > 1) {
                      const thanhvien = arr[1].split(" ")[0];

                      if (!isNaN(thanhvien)) {
                        setMembers((members) => {
                          members.map((user, i) => {
                            if (i === parseInt(thanhvien) - 1) {
                              socket.emit(
                                "text-to-speech",
                                `Bạn đã mute bạn ${user.fullname}`
                              );
                              socket.emit("mute user", user.socketId);
                            }
                          });
                          return members;
                        });
                      }
                    }
                  } else if (
                    result.data.toLowerCase().includes("tắt camera số ")
                  ) {
                    const arr = result.data
                      .toLowerCase()
                      .split("tắt camera số ");

                    if (arr.length > 1) {
                      const thanhvien = arr[1].split(" ")[0];

                      if (!isNaN(thanhvien)) {
                        setMembers((members) => {
                          members.map((user, i) => {
                            if (i === parseInt(thanhvien) - 1) {
                              socket.emit(
                                "text-to-speech",
                                `Bạn đã chặn chia sẻ camera bạn ${user.fullname}`
                              );
                              socket.emit("unshare user", user.socketId);
                            }
                          });
                          return members;
                        });
                      }
                    }
                  }
                }
                // }
                return me;
              });
              setChats((chats) => {
                if (result.type === "update") {
                  return chats.map((chat, index) => {
                    if (index === chats.length - 1)
                      return { ...chat, content: result.data };
                    return chat;
                  });
                }
                return [
                  ...chats,
                  {
                    userId: user.id,
                    username: user.fullname,
                    avatar: user.avatar,
                    content: result.data,
                    type: "voice",
                    time: new Date(),
                    color: user.color,
                  },
                ];
              });
            } else {
              setChats((chats) => [...chats, result]);
            }
            setStateChat((state) => {
              if (state)
                chatContainer.current.scrollIntoView({ behavior: "smooth" });
              return state;
            });
          });
        });
    }

    // return () => {
    //   if (isPassword !== "" && me) {
    //     const stream = myVideo.current.srcObject;
    //     const tracks = stream.getTracks();

    //     tracks.forEach(function (track) {
    //       track.stop();
    //     });

    //     myVideo.current.srcObject = null;
    //   }
    // };
  }, [isPassword, me]);

  const chatContainer = useRef<any>();
  const [stateChat, setStateChat] = useState(true);

  useEffect(() => {
    socket.emit("init room password", roomID);

    return () => {
      setIsMeetingAuth(false);

      if (myInfo?.data?.me) {
        update({
          timeSpend:
            myInfo.data.me.timeSpend +
            (new Date().valueOf() - meetingStartedTime.valueOf()),
        });
      }
    };
  }, []);

  const [joinFlag, setJoinFlag] = useState(false);

  useEffect(() => {
    if (me && myVideoTracks && myPeer?.id) {
      setMembers([me]);
      socket.emit("join room", roomID, me, myPeer.id);
      setJoinFlag(true);
    }
  }, [me, myVideoTracks, myPeer?.id]);

  const [flagSpeech, setFlagSpeech] = useState(false);

  useEffect(() => {
    if (speechApiFlag && myVideoTracks) {
      speechToText(myVideoTracks);
      setFlagSpeech(true);
    }
  }, [speechApiFlag, myVideoTracks]);

  const speechToText = (stream: any) => {
    try {
      //@ts-ignore
      context = new (window.AudioContext || window.webkitAudioContext)({
        // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
        latencyHint: "interactive",
      });

      processor = context.createScriptProcessor(bufferSize, 1, 1);
      processor.connect(context.destination);
      context.resume();

      input = context.createMediaStreamSource(stream);
      input.connect(processor);

      processor.onaudioprocess = (e: any) => {
        // console.log("haha");
        microphoneProcess(e);
      };
    } catch (err) {}
  };

  const microphoneProcess = (e: any) => {
    try {
      var left = e.inputBuffer.getChannelData(0);
      var left16 = downsampleBuffer(left, 44100, 16000);
      socket.emit("speech-to-text", left16, me);
    } catch (err) {}
  };

  const navbar_list = [
    {
      title: `Thành viên (${members.length})`,
      content: (
        <Member
          members={members}
          setInvite={setInvite}
          hostId={schedule?.data?.getSchedule?.schedule?.host?.id}
        />
      ),
    },
    {
      title: "Hội thoại",
      content: (
        <Chat
          setOnFiles={setOnFiles}
          members={members}
          socket={socket}
          me={me}
          chats={chats}
          chatContainer={chatContainer}
          meetingStartedTime={meetingStartedTime}
          stateChat={stateChat}
          setStateChat={setStateChat}
          flagSpeech={flagSpeech}
          speechCallBack={() => {
            speechToText(myVideoTracks);
            setFlagSpeech(true);
          }}
        />
      ),
    },
    {
      title: "Thư ký",
      content: (
        <Assistance
          members={members}
          chats={chats}
          socket={socket}
          setRecord={setRecord}
          meetingStartedTime={meetingStartedTime}
        />
      ),
    },
  ];

  if (myInfo.fetching) {
    return null;
  }

  return (
    <Container>
      {isPassword === "" || !me ? (
        <FormCenter>
          <MeetingAuthenForm
            me={me}
            socket={socket}
            setMe={setMe}
            isPassword={isPassword}
            setIsPassword={setIsPassword}
          />
        </FormCenter>
      ) : null}
      {config ? (
        <Config>
          <ConfigContainer>
            <Close onClick={() => setConfig(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-x-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
              </svg>
            </Close>
            <Name>Các từ khóa</Name>

            <Key>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="red"
                className="bi bi-door-open-fill"
                viewBox="0 0 16 16"
              >
                <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
              </svg>
              <span>Thoát phòng số [STT]</span>
            </Key>
            <Key>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="blue"
                className="bi bi-mic-mute-fill"
                viewBox="0 0 16 16"
              >
                <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z" />
                <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z" />
              </svg>
              <span>Tắt âm số [STT]</span>
            </Key>
            <Key>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="green"
                className="bi bi-camera-video-off-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l6.69 9.365zm-10.114-9A2.001 2.001 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728L.847 3.366zm9.746 11.925-10-14 .814-.58 10 14-.814.58z"
                />
              </svg>
              <span>Tắt camera số [STT]</span>
            </Key>
            <Input>
              <InputContainer>
                <Button>Room ID</Button>
                <RoomID value={useRouter().asPath.substring(6)} disabled />
                <Label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-clipboard"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                  </svg>
                </Label>
              </InputContainer>
              <InputContainer>
                <Button>Password</Button>
                <RoomID id="room-password" value={isPassword} disabled />
                <Label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-clipboard"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                  </svg>
                </Label>
              </InputContainer>
            </Input>
          </ConfigContainer>
        </Config>
      ) : null}
      {invite ? (
        <FormCenter setOnForm={setInvite} transparent={true}>
          <InviteMember members={members} />
        </FormCenter>
      ) : null}
      {record === "loading" ? (
        <FormCenter transparent={true}>
          <div
            style={{ padding: "2rem" }}
            ref={loading}
            className={style.lottie}
          ></div>
          <p
            style={{
              padding: "1.2rem",
              textAlign: "center",
              fontSize: "4rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Đang tải ...
          </p>
        </FormCenter>
      ) : record === "success" ? (
        <FormCenter transparent={true}>
          <div
            style={{ padding: "2rem" }}
            ref={success}
            className={style.lottie}
          ></div>
          <p
            style={{
              padding: "1.2rem",
              textAlign: "center",
              color: "#fff",
              fontSize: "4rem",
              fontWeight: 700,
            }}
          >
            Thành công
          </p>
        </FormCenter>
      ) : record === "success document" ? (
        <FormCenter transparent={true}>
          <div
            style={{ padding: "2rem" }}
            ref={successDocument}
            className={style.lottie}
          ></div>
          <p
            style={{
              padding: "1.2rem",
              textAlign: "center",
              color: "#fff",
              fontSize: "4rem",
              fontWeight: 700,
            }}
          >
            Tạo biên bản thành công
          </p>
        </FormCenter>
      ) : record === "error document" ? (
        <FormCenter transparent={true}>
          <div
            style={{ padding: "2rem" }}
            ref={error}
            className={style.lottie}
          ></div>
          <p
            style={{
              padding: "1.2rem",
              textAlign: "center",
              color: "#fff",
              fontSize: "4rem",
              fontWeight: 700,
            }}
          >
            Có vấn đề trong quá trình đăng biên bản
          </p>
        </FormCenter>
      ) : record === "error" ? (
        <FormCenter transparent={true}>
          <div
            style={{ padding: "2rem" }}
            ref={error}
            className={style.lottie}
          ></div>
          <p
            style={{
              padding: "1.2rem",
              textAlign: "center",
              color: "#fff",
              fontSize: "4rem",
              fontWeight: 700,
            }}
          >
            Video quá nặng
          </p>
        </FormCenter>
      ) : null}
      {onFiles ? (
        <FormCenter setOnForm={setOnFiles}>
          <div className={style.upload_container}>
            <FilePond
              className={style.filepond}
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              // maxFiles={3}
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />{" "}
            <div
              className={style.upload}
              onClick={() => {
                const chat = {
                  username: me.fullname,
                  avatar: me.avatar,
                  type: files[0].file.type.split("/")[0],
                  content: files[0].file.name,
                  time: new Date(),
                  userId: me.id,
                  color: me.color,
                };
                socket.emit("file", chat, files[0].file);
                setOnFiles(false);
                // socket.emit('')
              }}
            >
              Upload
            </div>
          </div>
        </FormCenter>
      ) : null}
      <Content>
        <MeetingScreen
          socket={socket}
          myVideo={myVideo}
          connections={connections}
        />
        <MeetingUtil
          myVideoTracks={myVideoTracks}
          isMute={isMute}
          isShare={isShare}
          setIsShare={setIsShare}
          setIsMute={setIsMute}
          joinFlag={joinFlag}
          setJoinFlag={setJoinFlag}
        />
      </Content>
      {/**
       * Meeting SideBar
       */}
      <div
        className={`${style.container} ${
          openMenu ? style.active : style.unactive
        }`}
      >
        <div
          className={`${style.menu_container} ${
            openMenu ? style.menu_active : style.menu_unactive
          }`}
        >
          <div className={style.header}>
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className={style.menu_container_btn}
            ></div>
            <div className={style.header_title}>Tiện ích</div>
            <div className={style.header_icon} onClick={() => setConfig(true)}>
              <SettingIcon />
            </div>
          </div>
        </div>
        <div className={style.navbar}>
          {navbar_list.map(({ title }, key) => {
            return (
              <div
                key={key}
                onClick={() => setNavbar(key)}
                className={`${style.navbar_item} ${
                  navbar === key ? style.navbar_active : null
                }`}
              >
                {title}
              </div>
            );
          })}
        </div>
        {navbar_list.map(({ content }, index) => {
          return (
            <div
              key={index}
              className={style.content}
              style={{ display: navbar === index ? "" : "none" }}
            >
              {content}
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Meeting;

const Content = styled.div`
  width: inherit;
  height: inherit;
  position: relative;
`;

const Container = styled.div`
  overflow: none;
  width: 100%;
  height: 100%;

  display: inline-flex;
`;

const Config = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);

  background-color: #fff;
  width: 30%;
  height: fit-content;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 2rem;
  padding: 2rem;

  @keyframes topdown {
    0% {
      transform: translate(-50%, -26rem);
    }
    100% {
      transform: translate(-50%, 0);
    }
  }
  animation: topdown 2s ease;
`;

const Name = styled.div`
  color: #050505;
  font-size: 3rem;
  font-weight: 700;
  margin-left: 1rem;
`;
const Key = styled.div`
  color: #050505;
  font-size: 2rem;
  margin-top: 1rem;
  margin-left: 1rem;

  span {
    margin-left: 1rem;
  }
`;

const ConfigContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`;

const Input = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RoomID = styled.input`
  width: 100%;
  height: 5rem;
  padding: 2rem;
  border: none;
`;
const Label = styled.button`
  width: 5.1rem;
  /* border: solid 0.1rem; */
`;
const Button = styled.button`
  /* height: 5.1rem; */
  width: 10rem;
  /* border: solid 0.1rem; */
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
`;
