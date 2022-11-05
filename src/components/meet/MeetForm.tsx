import React from "react";

import style from "../../styles/module/meet_form.module.scss";

import Earth from "../../../public/icon/earth.svg";
import Address from "../../../public/icon/address.svg";

import Mic from "../../../public/icon/mic.svg";
import Mute from "../../../public/icon/mute.svg";

import Share from "../../../public/icon/share.svg";
import Unshare from "../../../public/icon/unshare.svg";

import AddUser from "../../../public/icon/add-user.svg";
import Schedule from "../../../public/icon/schedule.svg";
import Triangle from "../../../public/icon/triangle.svg";

import Tick from "../../../public/icon/tick.svg";
import { useCreateMeetingMutation, useMeQuery } from "../../generated/graphql";
import { useRouter } from "next/router";

interface MeetFormProps {}

const MeetForm: React.FC<MeetFormProps> = ({}) => {
  const [isMute, setIsMute] = React.useState(true);
  const [isShare, setIsShare] = React.useState(true);
  const [option, setOption] = React.useState(false);
  const [text, setText] = React.useState("");

  const [join, setJoin] = React.useState(0);
  const [{ data }] = useMeQuery();

  const router = useRouter();
  const [, createMeeting] = useCreateMeetingMutation();

  const onCreateMeeting = async () => {
    const { data } = await createMeeting();
    const time = new Date();
    if (text === "") {
      router.push(
        `/meet/${data.createMeeting}?time=${
          time.getHours() + ":" + time.getMonth() + ":" + time.getSeconds()
        }`
      );
    } else {
      router.push("/meet/" + text);
    }
  };

  return (
    <div className={style.container}>
      {data?.me ? (
        <img className={style.avatar} src={data.me.avatar} alt="" />
      ) : (
        <div style={{ width: "1.5rem", height: "2rem" }}></div>
      )}

      <div className={style.content}>
        <input
          className={style.input}
          placeholder="Nhập mã phòng để tham gia cuộc họp"
          value={text}
          onChange={({ target }: any) => setText(target.value)}
        />
        <div className={style.list_btn}>
          <div className={style.state}>
            <div className={style.state_btn} onClick={() => setOption(true)}>
              <div className={style.icon}>{list_icon[join].icon}</div>
              <div className={style.text}>{list_icon[join].text}</div>
            </div>
            <div className={!option ? style.noDisplay : style.chooser}>
              <div className={style.pointer}>
                <Triangle />
              </div>
              <div>
                <div className={style.intro}>Ai có thể tham gia?</div>
                <div className={style.sub_intro}>
                  Chọn trong danh sách bạn bè để mời vào phòng họp.
                </div>
                <div className={style.list_option}>
                  {list_icon.map(({ icon, subtext }, index) => (
                    <div
                      key={index}
                      className={style.option}
                      onClick={() => {
                        setJoin(index);
                        setOption(false);
                      }}
                    >
                      <div className={style.option_icon}>{icon}</div>
                      <div className={style.option_text}>{subtext}</div>
                      {index === join ? (
                        <div className={style.option_choose}>
                          <Tick />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={style.btn_setting}>
            <div
              className={isMute ? style.unactive : style.active}
              onClick={() => setIsMute(!isMute)}
            >
              {!isMute ? <Mic /> : <Mute />}
            </div>
            <div
              className={isShare ? style.unactive : style.active}
              onClick={() => setIsShare(!isShare)}
            >
              {!isShare ? <Share /> : <Unshare />}
            </div>
            <div
              className={join === 1 ? style.active : style.disable}
              onClick={() => {}}
            >
              <AddUser />
            </div>
            <div className={style.active} onClick={() => {}}>
              <Schedule />
            </div>
          </div>

          <div
            id="create_meeting_btn"
            className={style.btn}
            onClick={onCreateMeeting}
          >
            {text === "" ? "Tạo phòng" : "Tham gia"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetForm;

const list_icon = [
  {
    icon: <Earth />,
    text: "Tất cả người dùng",
    subtext: "Mọi người",
  },
  {
    icon: <Address />,
    text: "Chỉ những người bạn và thành viên mời",
    subtext: "Chọn người dùng",
  },
];
