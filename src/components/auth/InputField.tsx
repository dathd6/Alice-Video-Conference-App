import React from "react";
import style from "../../styles/module/auth.module.scss";
import Triangle from "../../../public/icon/triangle.svg";
import { useField } from "formik";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: JSX.Element;
  placeholder: string;
  name: string;
  error: string;
};

const InputField: React.FC<InputFieldProps> = ({
  size: _,
  icon,
  error,
  ...props
}) => {
  const [field] = useField(props);

  return (
    <div className={style.input_field}>
      <div
        className={!error ? style.icon : style.icon + " " + style.icon_error}
      >
        {icon}
      </div>
      <input
        className={error ? style.input_field_error : style.input_field_normal}
        {...props}
        {...field}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? (
        <div className={style.error}>
          <div className={style.error_container}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-exclamation-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
            <div className={style.error_container_content}>
              <div className={style.pointer}>
                <Triangle />
              </div>
              <div>
                <div className={style.intro}>Username</div>
                <div className={style.sub_intro}>{error}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InputField;
