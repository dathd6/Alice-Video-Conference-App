import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import style from "../styles/module/profile.module.scss";
import styleForm from "../styles/module/schedule_form.module.scss";
import lottie from "lottie-web";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Layout
import Layout from "../layout/Layout";
import Header from "../components/header/Header";
import Top from "../../public/icon/star.svg";
import { useIsAuth } from "../utils/useIsAuth";
import { useMeQuery, useUpdateInfoMutation } from "../generated/graphql";
import { ContextType, month } from "../static/types";
import { useRouter } from "next/router";
import FormCenter from "../components/card/FormCenter";
import { Context } from "./_app";
import { InputContainer } from "../components/schedule/ScheduleForm";
import { Formik } from "formik";
import Empty from "../components/card/Empty";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = ({}) => {
  const [{ data }] = useMeQuery();
  const router = useRouter();

  if (!useIsAuth()) {
    return null;
  }

  const [myInfo] = useMeQuery();
  const [navbar, setNavbar] = useState(0);
  const [files, setFiles] = useState<any>([]);

  const [onEdit, setOnEdit] = useState<boolean | string>(false);
  const { socket, relationships } = useContext(Context) as ContextType;
  const [, update] = useUpdateInfoMutation();

  useEffect(() => {
    socket.on("receive file update", ({ url, type }: any) => {
      if (type === "banner") {
        update({ banner: url });
      } else if (type === "avatar") {
        update({ avatar: url });
      }
      setOnEdit(false);
    });
  }, []);

  const joinedDateRender = (joined: string) => {
    const date = new Date(joined);
    return month[date.getMonth()] + " " + date.getFullYear();
  };

  return (
    <Layout
      form={
        onEdit === false ? null : onEdit === "banner" ||
          onEdit === "avatar" ||
          onEdit === "onloading" ? (
          <FormCenter setOnForm={setOnEdit}>
            <div className={style.upload_container}>
              <FilePond
                className={style.filepond}
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={false}
                // maxFiles={3}
                name="files"
                labelIdle="Kéo thả hình ảnh"
              />

              {onEdit === "onloading" ? (
                <div className="center">
                  <div className="loader"></div>
                </div>
              ) : (
                <div
                  className={style.upload}
                  onClick={() => {
                    socket.emit("update", {
                      id: data?.me?.id,
                      file: files[0].file,
                      type: onEdit,
                    });
                    setOnEdit("onloading");
                  }}
                >
                  Đăng
                </div>
              )}
            </div>
          </FormCenter>
        ) : (
          <FormCenter setOnForm={setOnEdit}>
            <div
              className={styleForm.container}
              style={{ height: "fit-content" }}
            >
              <Formik
                initialValues={{
                  username: data?.me?.username,
                  fullname: data?.me?.fullname,
                  email: data?.me?.email,
                }}
                onSubmit={async ({ username, fullname, email }) => {
                  if (username && fullname && email) {
                    await update({
                      fullname,
                      email,
                      username,
                    });

                    setOnEdit(false);
                  }
                }}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <form
                    action="#"
                    className={styleForm.form}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <InputContainer
                      autoComplete="off"
                      type="text"
                      name="fullname"
                      placeholder="Họ và tên"
                      onChange={handleChange}
                      value={values.fullname}
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path
                            fillRule="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                          />
                        </svg>
                      }
                    />

                    <InputContainer
                      autoComplete="off"
                      type="text"
                      name="username"
                      onChange={handleChange}
                      placeholder="Tên người dùng"
                      value={values.username}
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

                    <InputContainer
                      autoComplete="off"
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      value={values.email}
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

                    <div className={styleForm.button}>
                      <button type="submit" onClick={() => handleSubmit}>
                        Cập nhật
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </FormCenter>
        )
      }
    >
      <Header
        title={
          <Title>
            <Text>{data.me.email}</Text>
          </Title>
        }
        icon={<Top />}
      />
      <div className={style.container}>
        <div
          className={style.banner}
          style={{
            background: `url(${data?.me.banner})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div className={style.edit} onClick={() => setOnEdit("banner")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="#fff"
              className="bi bi-camera"
              viewBox="0 0 16 16"
            >
              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
            </svg>
          </div>
        </div>
        <div className={style.wrap}>
          <div className={style.avatar}>
            <img src={data.me.avatar} alt={""} />
            <div className={style.edit} onClick={() => setOnEdit("avatar")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-camera"
                viewBox="0 0 16 16"
              >
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
              </svg>
            </div>
          </div>
          <div className={style.button} onClick={() => setOnEdit("info")}>
            Chỉnh sửa
          </div>
          <div className={style.username}>{data.me.fullname}</div>
          <div className={style.hashtag}>{"@" + data.me.username}</div>
          <div className={style.time}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-calendar3"
              viewBox="0 0 16 16"
            >
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
            <span>Tham gia {joinedDateRender(data.me.createdAt)}</span>
          </div>
        </div>
        <div className={style.navbar}>
          <div
            onClick={() => setNavbar(0)}
            className={`${style.navbar_item} ${
              navbar === 0 ? style.navbar_active : null
            }`}
          >
            Bạn bè
          </div>
          <div
            onClick={() => setNavbar(1)}
            className={`${style.navbar_item} ${
              navbar === 1 ? style.navbar_active : null
            }`}
          >
            Người gửi lời mời kết bạn
          </div>
        </div>
        {navbar === 0 ? (
          <ul className={style.list}>
            {relationships.filter(
              ({ relationship }) => relationship === "follow"
            ).length === 0 ? (
              <Empty />
            ) : (
              relationships
                .filter(({ relationship }) => relationship === "follow")
                .map(({ user: { avatar, fullname, username, id } }, index) => {
                  return (
                    <li key={index} className={style.item}>
                      <div className={style.avatar}>
                        <img src={avatar} alt="" />
                      </div>
                      <div className={style.info}>
                        <div className={style.fullname}>{fullname}</div>
                        <div className={style.username}>{"@" + username}</div>
                      </div>
                      <div
                        onClick={() => router.push(`/profile/${id}`)}
                        className={style.button}
                      >
                        Xem trang cá nhân
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        ) : (
          <ul className={style.list}>
            {relationships.filter(
              ({ relationship }) =>
                relationship !== "follow" &&
                relationship !== `${myInfo?.data?.me?.id}`
            ).length === 0 ? (
              <Empty />
            ) : (
              relationships
                .filter(
                  ({ relationship }) =>
                    relationship !== "follow" &&
                    relationship !== `${myInfo?.data?.me?.id}`
                )
                .map(({ user: { avatar, fullname, username, id } }, index) => {
                  return (
                    <li key={index} className={style.item}>
                      <div className={style.avatar}>
                        <img src={avatar} alt="" />
                      </div>
                      <div className={style.info}>
                        <div className={style.fullname}>{fullname}</div>
                        <div className={style.username}>{"@" + username}</div>
                      </div>
                      <div
                        onClick={() => router.push(`/profile/${id}`)}
                        className={style.button}
                      >
                        Xem trang cá nhân
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

const Text = styled.div`
  margin-left: 1rem;
  span {
    color: #9da9bb;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  margin-right: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
`;
