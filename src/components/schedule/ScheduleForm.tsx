import { Formik, useField } from "formik";
import React, { useContext, useState } from "react";
import style from "../../styles/module/schedule_form.module.scss";
import { ContextType, dayOfTheWeek } from "../../static/types";
import "draft-js/dist/Draft.css";
import {
  ScheduleFragmentFragment,
  useCreateNotificationMutation,
  useDeleteScheduleMutation,
  useGetUserFromScheduleQuery,
  useMeQuery,
  useSaveScheduleMutation,
  useSearchUserQuery,
  useUpdateScheduleMutation,
} from "../../generated/graphql";
import _ from "lodash";
import { Context } from "../../pages/_app";
import { useEffect } from "react";
import router, { useRouter } from "next/router";

interface ScheduleFormProps {
  setForm: React.Dispatch<React.SetStateAction<boolean>>;
  schedule?: ScheduleFragmentFragment;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleFragmentFragment>>;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  setForm,
  schedule,
  setSchedule,
}) => {
  const { socket, setSchedules, relationships } = useContext(
    Context
  ) as ContextType;
  const router = useRouter();
  const [, createNotification] = useCreateNotificationMutation();

  const [active, setActive] = useState(
    schedule?.dateType === "all"
      ? 2
      : schedule?.dateType.includes("T") || schedule?.dateType.includes("CN")
      ? 1
      : 0
  );
  const [addMember, setAddMember] = useState("");
  const [panel, setPanel] = useState(false);

  const [onBanner, setOnBanner] = useState(false);
  const [banner, setBanner] = useState(
    schedule ? list_banner.indexOf(schedule?.banner) : 0
  );

  const [{ data }] = useSearchUserQuery({
    variables: {
      search: addMember,
      friend: true,
    },
  });

  const [dateActive, setDateActive] = useState(
    dayOfTheWeek.map((value) => {
      return {
        date: value,
        active: schedule?.dateType.includes(value) ? true : false,
      };
    })
  );

  const [myInfo] = useMeQuery();

  const [, save] = useSaveScheduleMutation();

  const errorMap = useState<Record<string, string>>();

  const toDate = (dates: typeof dateActive) => {
    let result: string = "";
    dates.map(({ active, date }) => {
      if (active) result += `${date}-`;
    });
    return result;
  };

  const [userFromSchedule] = useGetUserFromScheduleQuery({
    variables: {
      scheduleId: schedule?.id,
    },
  });
  const [members, setMembers] = useState(
    userFromSchedule?.data?.getUserFromSchedule
      ? userFromSchedule?.data.getUserFromSchedule.filter(({ id }) => {
          return id !== myInfo?.data?.me?.id;
        })
      : []
  );
  const [, erase] = useDeleteScheduleMutation();
  const [, update] = useUpdateScheduleMutation();

  return (
    <div className={style.container}>
      <Formik
        initialValues={{
          title: schedule ? schedule?.title : "",
          date:
            schedule &&
            schedule?.dateType !== "all" &&
            (!schedule?.dateType.includes("T") ||
              !schedule?.dateType.includes("CN"))
              ? schedule?.dateType
              : "",
          time: schedule ? schedule?.startAt : "",
          description: schedule ? schedule?.description : "",
          company: schedule ? schedule?.company : "",
        }}
        onSubmit={async ({ title, description, company, time, date }) => {
          let dateType =
            active === 0 ? date : active === 1 ? toDate(dateActive) : "all";

          if (time === "") {
            errorMap["time"] = "Cần chọn thời gian cho lịch họp";
          } else {
            errorMap["time"] = null;
          }
          if (title === "") {
            errorMap["title"] = "Lịch họp cần tiêu đề";
          } else {
            errorMap["title"] = null;
          }
          if (date === "") {
            errorMap["date"] = "Hãy chọn ngày họp";
          } else {
            errorMap["date"] = null;
          }

          if (time && title) {
            if (schedule) {
              update({
                id: schedule?.id,
                title,
                banner: list_banner[banner],
                dateType,
                members: members.map(({ id }) => {
                  return id;
                }),
                startAt: time,
                description,
                company,
              }).then(async (result) => {
                setSchedules((schedules) =>
                  schedules.map((data) => {
                    if (data?.id === result?.data?.updateSchedule?.id) {
                      return result?.data?.updateSchedule;
                    }
                    return data;
                  })
                );
                await Promise.all(
                  members.map(async ({ id }) => {
                    if (
                      userFromSchedule?.data?.getUserFromSchedule?.find(
                        (info) => info.id === id
                      )
                    ) {
                      socket.emit("update schedule", {
                        id,
                        schedule: result?.data?.updateSchedule,
                      });
                      const notification = await createNotification({
                        content: `vừa chỉnh sửa lịch họp "${result?.data?.updateSchedule?.title}"`,
                        url: "/schedule",
                        receiver: id,
                        type: "schedule",
                        isSeen: false,
                      });

                      socket.emit(
                        "send notification",
                        notification?.data?.createNotification
                      );
                    } else {
                      socket.emit("send schedule", {
                        id,
                        schedule: result?.data?.updateSchedule,
                      });
                      const notification = await createNotification({
                        content: `thêm bạn vào lịch họp mới "${result?.data?.updateSchedule?.title}"`,
                        url: "/schedule",
                        receiver: id,
                        type: "schedule",
                        isSeen: false,
                      });

                      socket.emit(
                        "send notification",
                        notification?.data?.createNotification
                      );
                    }
                  })
                );
                await Promise.all(
                  userFromSchedule?.data?.getUserFromSchedule.map(
                    async ({ id }) => {
                      if (
                        id !== myInfo?.data?.me?.id &&
                        !members.find((info) => info.id === id)
                      ) {
                        socket.emit("delete schedule", {
                          id,
                          scheduleId: schedule?.id,
                        });
                        const notification = await createNotification({
                          content: `buộc bạn ra khỏi lịch họp "${result?.data?.updateSchedule?.title}"`,
                          url: "/schedule",
                          receiver: id,
                          type: "out schedule",
                          isSeen: false,
                        });

                        socket.emit(
                          "send notification",
                          notification?.data?.createNotification
                        );
                      }
                    }
                  )
                );
              });
            } else {
              save({
                title,
                banner: list_banner[banner],
                dateType,
                members: members.map(({ id }) => {
                  return id;
                }),
                startAt: time,
                description,
                company,
              }).then(async (schedule) => {
                setSchedules((schedules) => [
                  ...schedules,
                  schedule?.data?.saveSchedule,
                ]);

                await Promise.all(
                  members.map(async ({ id }) => {
                    socket.emit("send schedule", {
                      id,
                      schedule: schedule?.data?.saveSchedule,
                    });
                    const notification = await createNotification({
                      content: `thêm bạn vào lịch họp mới "${schedule?.data?.saveSchedule?.title}"`,
                      url: `${schedule?.data?.saveSchedule?.id}`,
                      receiver: id,
                      type: "schedule",
                      isSeen: false,
                    });

                    socket.emit(
                      "send notification",
                      notification?.data?.createNotification
                    );
                  })
                );
              });
            }

            setSchedule(null);
            setForm(false);
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form
            action="#"
            className={style.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <InputContainer
              autoComplete="off"
              className={style.title}
              type="title"
              name="title"
              placeholder="Tiêu đề buổi họp"
              error={errorMap["title"]}
              onChange={handleChange}
              value={values.title}
            />
            {/* <div
              style={{
                border: "1px solid black",
                minHeight: "6em",
                cursor: "text",
              }}
              onClick={focusEditor}
            >
              <Editor
                ref={editor}
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Write something!"
              />
            </div> */}

            <div className={style.list_config}>
              {list_config.map((config, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setActive(index)}
                    className={`${style.config} ${
                      index === active ? style.active : null
                    }`}
                  >
                    {config}
                  </div>
                );
              })}
            </div>

            <InputContainer
              autoComplete="off"
              type="time"
              name="time"
              error={errorMap["time"]}
              onChange={handleChange}
              placeholder="Thời gian"
              value={values.time}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-clock-history"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                </svg>
              }
            />

            {active === 0 ? (
              <InputContainer
                autoComplete="off"
                type="date"
                name="date"
                error={errorMap["date"]}
                onChange={handleChange}
                placeholder="date"
                value={values.date}
              />
            ) : active === 1 ? (
              <div className={style.weeks}>
                {dateActive.map(({ active, date }, index) => {
                  return (
                    <div
                      key={index}
                      className={`${style.week} ${
                        active ? style.active : null
                      }`}
                      onClick={() =>
                        setDateActive(
                          dateActive.map((value, key) => {
                            if (key === index) {
                              return {
                                ...value,
                                active: !value.active,
                              };
                            } else return value;
                          })
                        )
                      }
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className={style.add_member}>
              <InputContainer
                autoComplete="off"
                type="text"
                placeholder="Thêm thành viên"
                name="member"
                onChange={({ target: { value } }) => {
                  setAddMember(value);
                  setPanel(true);
                }}
                value={addMember}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-people"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  </svg>
                }
              />
              {members.length > 0 ? (
                <>
                  <div className={style.item}>
                    <div className={style.avatar}>
                      <img src={myInfo.data?.me?.avatar} alt="" />
                    </div>
                    <div className={style.info}>
                      <div className={style.username}>
                        <p>{myInfo.data?.me?.fullname} </p>
                      </div>
                      <div className={style.tag}>
                        {"@" + myInfo.data?.me?.username}
                      </div>
                    </div>
                    <div className={style.icon}>
                      <p>Chủ phòng</p>
                    </div>
                  </div>
                  {members.map(({ username, fullname, avatar }, key) => {
                    return (
                      <div key={key} className={style.item}>
                        <div className={style.avatar}>
                          <img src={avatar} alt="" />
                        </div>
                        <div className={style.info}>
                          <div className={style.username}>
                            <p>{fullname} </p>
                          </div>
                          <div className={style.tag}>{"@" + username}</div>
                        </div>
                        <div
                          onClick={() => {
                            setMembers(
                              members.filter((data) => {
                                return username !== data?.username;
                              })
                            );
                          }}
                          className={style.icon}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-x"
                            viewBox="0 0 16 16"
                          >
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}
              <ul className={style.friends}>
                {panel
                  ? data.searchUser.map(({ user }, key) => {
                      return (
                        <li
                          key={key}
                          className={style.item}
                          onClick={() => {
                            if (
                              members.filter((u) => {
                                return u.id === user.id;
                              }).length === 0
                            ) {
                              setMembers([...members, user]);
                            }
                            setPanel(false);
                            setAddMember("");
                          }}
                        >
                          <div className={style.avatar}>
                            <img src={user.avatar} alt="" />
                          </div>
                          <div className={style.info}>
                            <div className={style.username}>
                              <p>{user.fullname} </p>
                            </div>
                            <div className={style.tag}>
                              {"@" + user.username}
                            </div>
                          </div>
                        </li>
                      );
                    })
                  : null}
              </ul>
            </div>

            <InputContainer
              autoComplete="off"
              type="text"
              name="company"
              placeholder="Tên tổ chức"
              onChange={handleChange}
              value={values.company}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-building"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
                  />
                  <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
                </svg>
              }
            />

            <div className={style.input_container}>
              <div className={style.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-info-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </div>
              <textarea
                autoComplete="off"
                // type="text"
                className={style.input}
                name="description"
                placeholder="Mô tả"
                onChange={handleChange}
                value={values.description}
                style={{ border: 0, fontSize: 15, paddingLeft: "1rem" }}

                // icon={

                // }
              />
            </div>

            <div className={style.input_container}>
              <div className={style.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-palette"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                  <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
                </svg>
              </div>
              <div
                className={style.image}
                onClick={() => {
                  setOnBanner(!onBanner);
                }}
              >
                <img src={list_banner[banner]} />
              </div>
              {onBanner ? (
                <div className={style.banner}>
                  {list_banner.map((image, index) => {
                    return (
                      <div
                        key={index}
                        className={style.banner_item}
                        onClick={() => {
                          setBanner(index);
                          setOnBanner(false);
                        }}
                      >
                        <img src={image} alt="" />
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className={style.button}>
              {schedule ? (
                <button
                  type="button"
                  style={{ backgroundColor: "red", marginRight: "1rem" }}
                  onClick={async () => {
                    await erase({ id: schedule?.id });
                    setSchedules((schedules) =>
                      schedules.filter(({ id }) => id !== schedule?.id)
                    );
                    await Promise.all(
                      members.map(async ({ id }) => {
                        socket.emit("delete schedule", {
                          id,
                          scheduleId: schedule?.id,
                        });
                        const notification = await createNotification({
                          content: `đã xóa lịch họp "${schedule?.title}"`,
                          url: `/schedule`,
                          receiver: id,
                          type: "delete schedule",
                          isSeen: false,
                        });

                        socket.emit(
                          "send notification",
                          notification?.data?.createNotification
                        );
                      })
                    );
                    setForm(false);
                    setSchedule(null);
                  }}
                >
                  Xóa
                </button>
              ) : null}
              <button type="submit" onClick={() => handleSubmit}>
                {schedule ? "Sửa" : "Lưu"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export const list_banner = [
  "https://img.freepik.com/free-vector/winter-background-with-pastel-color-brushes-leaves_220290-42.jpg?size=626&ext=jpg",
  "https://bbdu.ac.in/wp-content/uploads/2020/05/banner-background-4.jpg",
  "https://png.pngtree.com/thumb_back/fh260/background/20200530/pngtree-colorful-banner-red-and-yellow-background-image_337446.jpg",
  "https://png.pngtree.com/thumb_back/fh260/back_pic/04/30/97/425841877ca8f16.jpg",
  "https://previews.123rf.com/images/artlana/artlana1903/artlana190300130/124177114-banner-background-with-colorful-watercolor-imitation-splash-blots-frame-template-for-your-designs-.jpg",
  "https://i.pinimg.com/originals/6b/20/16/6b201623685e7093fe7df8970b1d26b5.jpg",
];

type InputContainerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: JSX.Element;
  placeholder: string;
  name: string;
  error?: string;
  //   error: string;
};

const list_config = ["Một ngày", "Hàng tuần", "Hằng ngày"];

export const InputContainer: React.FC<InputContainerProps> = ({
  icon,
  error,
  ...props
}) => {
  const [field] = useField(props);

  return (
    <div className={style.input_container}>
      {!error ? (
        <>
          <div className={style.icon}>{icon}</div>
          <input
            id={field.name}
            className={style.input}
            {...props}
            placeholder={props.placeholder}
          />
        </>
      ) : (
        <>
          <div className={style.icon + " " + style.error}>{icon}</div>
          <input
            id={field.name}
            className={style.input + " " + style.error}
            {...props}
            placeholder={props.placeholder}
          />
          <div></div>
          <div className={style.warning}>
            <svg
              style={{ marginRight: "1rem" }}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-exclamation-lg"
              viewBox="0 0 16 16"
            >
              <path d="M6.002 14a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm.195-12.01a1.81 1.81 0 1 1 3.602 0l-.701 7.015a1.105 1.105 0 0 1-2.2 0l-.7-7.015z" />
            </svg>
            {error}
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleForm;
