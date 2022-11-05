import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import lottie from "lottie-web";

import style from "../../styles/module/auth.module.scss";
import Social from "./Social";

import LockIcon from "../../../public/icon/lock.svg";
import MailIcon from "../../../public/icon/at.svg";
import { useLoginMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import InputField from "./InputField";

interface SignInFormProps {}

const SignInForm: React.FC<SignInFormProps> = ({}) => {
  const [errors, setErrors] = useState<any>({});
  const [, login] = useLoginMutation();
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
      initialValues={{ email: "", password: "" }}
      onSubmit={async ({ email, password }) => {
        const {
          data: {
            login: { user, errors },
          },
        } = await login({ password, usernameOrEmail: email });

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
        <form action="#" className={style.sign_in_form}>
          <h2 className={style.title}>Đăng nhập</h2>

          <InputField
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={values.email}
            error={errors.usernameOrEmail}
            icon={<MailIcon />}
          />

          <InputField
            type="password"
            placeholder="Mật khẩu"
            name="password"
            onChange={handleChange}
            value={values.password}
            error={errors.password}
            icon={<LockIcon />}
          />

          {!isSubmitting ? (
            <button
              type="submit"
              //@ts-ignore
              onClick={handleSubmit}
              className={`${style.btn} ${style.solid}`}
            >
              Đăng nhập
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

export default SignInForm;
