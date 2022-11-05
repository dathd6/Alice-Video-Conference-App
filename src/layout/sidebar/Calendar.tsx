import React, { useState } from "react";

//icon
import style from "../../styles/module/calendar.module.scss";
import BackArrow from "../../../public/icon/left-arrow.svg";
import ForwardArrow from "../../../public/icon/right-arrow.svg";
import { date_highlight_color, dayOfTheWeek, month } from "../../static/types";
import { getDaysInMonth } from "../../utils/getDaysInMonth";

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = ({}) => {
  const [currMonth, setCurrMonth] = useState(new Date().getMonth());
  const [currYear, setCurrYear] = useState(new Date().getFullYear());

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>{month[currMonth] + " " + currYear}</div>
        <div className={style.groupArrow}>
          <BackArrow
            className={style.backward}
            onClick={() => {
              setCurrMonth(currMonth === 0 ? 11 : currMonth - 1);
              setCurrYear(currMonth === 0 ? currYear - 1 : currYear);
            }}
            style={{ marginRight: "1rem" }}
          />

          <ForwardArrow
            className={style.forward}
            onClick={() => {
              setCurrMonth(currMonth === 11 ? 0 : currMonth + 1);
              setCurrYear(currMonth === 11 ? currYear + 1 : currYear);
            }}
          />
        </div>
      </div>
      <div className={style.calendar}>
        {dayOfTheWeek.map((value, index) => {
          return (
            <div key={index} className={style.day_of_the_week}>
              {value}
            </div>
          );
        })}
        {getDaysInMonth(currMonth, currYear).map(
          ({ date, month, event }, index) => {
            return (
              <div
                key={index}
                className={`${style.date} ${
                  new Date().getDate() === date &&
                  month === new Date().getMonth()
                    ? style.active
                    : ""
                } ${month !== currMonth ? style.another_month : ""}`}
              >
                {date}
                <div className={style.list_event}>
                  {event.map((ev, index) => {
                    return (
                      <div
                        key={index}
                        style={{ backgroundColor: date_highlight_color[ev] }}
                        className={style.event}
                      ></div>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Calendar;
