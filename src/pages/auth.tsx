import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Panels from "../components/auth/Panels";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import style from "../styles/module/auth.module.scss";
import { createUrqlClient } from "../utils/createUrqlClient";

interface AuthProps {}

const Auth: React.FC<AuthProps> = ({}) => {
  const [signUpMode, setSignUpMode] = React.useState(false);
  const router = useRouter();

  return (
    <div
      className={`${style.container} ${signUpMode ? style.sign_up_mode : null}`}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: "1.2rem",
          left: "2rem",
          cursor: "pointer",
        }}
        onClick={() => {
          router.back();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#fff"
          className="bi bi-arrow-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </div>
      <div className={style.forms_container}>
        <div className={style.signin_signup}>
          <SignInForm />
          <SignUpForm />
        </div>
      </div>
      <Panels setSignUpMode={setSignUpMode} />
    </div>
  );
};

export default Auth;
