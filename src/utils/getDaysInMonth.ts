import { dayOfTheWeek } from "../static/types";

interface DaysInMonthProps {
  dayOfTheWeek: string;
  date: number;
  month: number;
  event: string[];
}

const date_highlight = [
  {
    date: 6,
    month: 1,
    color: [1, 2],
  },
  {
    date: 10,
    month: 1,
    color: [2, 3],
  },
  {
    date: 22,
    month: 1,
    color: [0],
  },
  {
    date: 1,
    month: 2,
    color: [0, 3, 1],
  },
];

export const getDaysInMonth = (
  month: number,
  year: number
): DaysInMonthProps[] => {
  var date = new Date(year, month, 1);
  var days = [];
  let prevMonthDate = new Date(date);
  prevMonthDate.setDate(0);

  while (true) {
    days = [
      {
        dayOfTheWeek: dayOfTheWeek[prevMonthDate.getDay()],
        date: prevMonthDate.getDate(),
        month: prevMonthDate.getMonth(),
      },
      ...days,
    ];
    if (prevMonthDate.getDay() === 0) break;
    prevMonthDate.setDate(prevMonthDate.getDate() - 1);
  }

  while (date.getMonth() === month) {
    days.push({
      dayOfTheWeek: dayOfTheWeek[date.getDay()],
      date: date.getDate(),
      month: date.getMonth(),
    });
    date.setDate(date.getDate() + 1);
  }

  while (days.length < 42) {
    days.push({
      dayOfTheWeek: dayOfTheWeek[date.getDay()],
      date: date.getDate(),
      month: date.getMonth(),
    });
    date.setDate(date.getDate() + 1);
  }

  days = days.map((d) => {
    let event = [];
    date_highlight.forEach(({ date, month, color }) => {
      if (d.date === date && d.month === month) {
        event = color;
      }
    });
    return { ...d, event };
  });

  return days;
};
