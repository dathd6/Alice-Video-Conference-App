import React, { useEffect, useRef, useState } from "react";
import style from "../../styles/module/auth.module.scss";
import lottie from "lottie-web";

import Social from "./Social";
import LockIcon from "../../../public/icon/lock.svg";
import UserIcon from "../../../public/icon/user_v0.svg";
import MailIcon from "../../../public/icon/at.svg";
import FullNameIcon from "../../../public/icon/name.svg";
import { Formik } from "formik";
import { useRegisterMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import InputField from "./InputField";
import { toErrorMap } from "../../utils/toErrorMap";

interface SignUpFormProps {}

const SignUpForm: React.FC<SignUpFormProps> = ({}) => {
  const [errors, setErrors] = useState<any>({});
  const [, register] = useRegisterMutation();
  const router = useRouter();
  const loadLottie = useRef<any>(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: loadLottie.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../../public/json/load.json"),
    });
  }, []);

  return (
    <Formik
      initialValues={{ userName: "", email: "", password: "", fullName: "" }}
      onSubmit={async ({ userName, email, password, fullName }) => {
        const {
          data: {
            register: { user, errors },
          },
        } = await register({
          options: {
            username: userName,
            fullName,
            email,
            password,
          },
        });

        if (errors) {
          setErrors(toErrorMap(errors));
        } else if (user) {
          if (typeof router.query.next === "string") {
            router.push(router.query.next);
          } else {
            router.push("/");
          }
        }
      }}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <form action="#" className={style.sign_up_form}>
          <h2 className={style.title}>Đăng ký</h2>

          <InputField
            type="text"
            name="userName"
            placeholder="Tên người dùng"
            onChange={handleChange}
            value={values.userName}
            error={errors.username}
            icon={<UserIcon />}
          />

          <InputField
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={values.email}
            error={errors.email}
            icon={<MailIcon />}
          />

          <InputField
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            onChange={handleChange}
            value={values.fullName}
            error={errors.fullname}
            icon={<FullNameIcon />}
          />

          <InputField
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            icon={<LockIcon />}
          />

          {!isSubmitting ? (
            <button
              type="submit"
              //@ts-ignore
              onClick={handleSubmit}
              className={style.btn}
            >
              Đăng ký
            </button>
          ) : (
            <div
              style={{
                height: "6.9rem",
              }}
              ref={loadLottie}
              className={style.load}
            ></div>
          )}
          <p className={style.social_text}>
            Hoặc đăng nhập thông qua các trang mạng xã hội
          </p>
          <Social />
        </form>
      )}
    </Formik>
  );
};

export default SignUpForm;
