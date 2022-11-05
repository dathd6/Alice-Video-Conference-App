import React, { useEffect, useRef } from "react";

const Video = ({ conn }: any) => {
  const ref = useRef<any>();

  useEffect(() => {
    // console.log(peer);
    // peer.on("stream", (stream: MediaStream) => {
    //   ref.current.srcObject = stream;
    // });
    conn.on("stream", (stream: MediaStream) => {
      ref.current.srcObject = stream;

      // var mediaElementSource = new MediaElementAudioSourceNode(context, {
      //   mediaElement: ref.current,
      // });
      // mediaElementSource.connect(audioTracks);
    });

    return () => {
      try {
        ref.current.srcObject.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      } catch (err) {}
      // peer.disconnect();
    };
  }, []);

  return <video playsInline autoPlay ref={ref} />;
};

interface MeetingScreenProps {
  myVideo: any;
  connections: any[];
  socket: any;
}

const MeetingScreen: React.FC<MeetingScreenProps> = ({
  myVideo,
  connections,
}) => {
  // console.log(peers);

  // useEffect(() => {
  //   if (myVideo.current.srcObject) {
  //     startRecording();
  //   }
  // }, [myVideo.current.srcObject]);

  return (
    <div className="meet_screen">
      <div id="meet_screen_main" className="meet_screen_main">
        <video muted ref={myVideo} autoPlay playsInline />
      </div>
      <ul id="meet_screen_list" className="meet_screen_list">
        {connections.map((conn, index: number) => {
          return (
            <li key={index} className="meet_screen_list_item">
              <Video conn={conn} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MeetingScreen;
