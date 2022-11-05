import React from "react";
import style from "../../styles/module/media.module.scss";
// import { VideoJsPlayer } from "video.js";

interface RecordedDocumentProps {}

const RecordedDocument: React.FC<RecordedDocumentProps> = ({}) => {
  // const videoJsOptions = {
  //   autoplay: false,
  //   playbackRates: [0.5, 1, 1.25, 1.5, 2],
  //   width: 720,
  //   height: 300,
  //   controls: true,
  //   sources: [
  //     {
  //       src: "https://vjs.zencdn.net/v/oceans.mp4",
  //       type: "video/mp4",
  //     },
  //   ],
  // };
  return (
    <div className={style.container}>
      <div className={style.header}>Video audio recorded</div>
      <video controls src="https://vjs.zencdn.net/v/oceans.mp4" />
      {/* <VideoJsPlayer {...videoJsOptions} /> */}
      {/* <audio className={style.audio} controls preload="metadata">
        <source
          src="https://assets.codepen.io/4358584/Anitek_-_Komorebi.mp3"
          type="audio/ogg"
        />
      </audio> */}
    </div>
  );
};

export default RecordedDocument;
