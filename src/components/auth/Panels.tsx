import React from "react";
import style from "../../styles/module/auth.module.scss";

interface PanelsProps {
  setSignUpMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Panels: React.FC<PanelsProps> = ({ setSignUpMode }) => {
  return (
    <div className={style.panels_container}>
      <div className={`${style.panel} ${style.left_panel}`}>
        <div className={style.content}>
          <h3>Lần đầu sử dụng ứng dụng?</h3>
          <p>
            Hãy tạo ngay tài khoản cho bạn để có thể kết nối tới những người
            dùng khác và tăng hiệu xuất công việc ngay nào
          </p>
          <button
            className={`${style.btn} ${style.transparent}`}
            style={{ width: "16rem" }}
            onClick={() => setSignUpMode(true)}
            id="sign-up-btn"
          >
            Tạo tài khoản
          </button>
        </div>
        <img src="images/log.svg" className={style.image} alt="" />
      </div>
      <div className={`${style.panel} ${style.right_panel}`}>
        <div className={style.content}>
          <h3>Đã đăng ký tài khoản ?</h3>
          <p>
            Nhanh tay đăng nhập vào hệ thống để sử dụng những chức năng của ứng
            dụng đi nào
          </p>
          <button
            className={`${style.btn} ${style.transparent}`}
            onClick={() => setSignUpMode(false)}
            id="style.sign-in-btn"
          >
            Đăng nhập
          </button>
        </div>
        <img src="images/register.svg" className={style.image} alt="" />
      </div>
    </div>
  );
};

export default Panels;
