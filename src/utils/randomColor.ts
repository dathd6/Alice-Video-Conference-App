export const randomColor = () => {
  let color: string = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  while (color === "#ffffff") {
    color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
  return color;
};
