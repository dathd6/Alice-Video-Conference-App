export const voiceValidation = (
  chats: any[],
  data: string,
  user: any
): { type: string; data: string } => {
  let userStr: string = "";
  let userArr = chats
    .map((chat, index) => ({ ...chat, stt: index }))
    .filter((chat) => {
      if (chat.type === "voice" && chat.username === user.fullname) {
        userStr += chat.content.toLowerCase();
        return true;
      }
      return false;
    });
  let last_child_index = userArr.length - 1;

  if (
    userStr
      .toLowerCase()
      .substring(last_child_index + 1 - data.length, data.length)
      .includes(data.toLowerCase())
  ) {
    return {
      type: "none",
      data,
    };
  }

  if (
    last_child_index >= 0 &&
    data.toLowerCase().includes(userArr[last_child_index].content.toLowerCase())
  ) {
    const lastChild = userArr[last_child_index].content.toLowerCase();

    if (
      data.toLowerCase().indexOf(lastChild) === 0 &&
      userArr[last_child_index].stt === chats.length - 1
    ) {
      return {
        type: "update",
        data,
      };
    }

    const index = data.toLowerCase().indexOf(lastChild) + lastChild.length;
    const str = data.substring(index, data.length - index);
    const du_ra = data.substring(0, data.length - str.length);

    console.log("inside");
    console.log("data", data.toLowerCase());
    if (last_child_index >= 0)
      console.log("lastChild", userArr[last_child_index].content.toLowerCase());
    console.log(du_ra);
    console.log(
      userStr
        .toLowerCase()
        .substring(last_child_index + 1 - du_ra.length, du_ra.length)
    );

    if (du_ra.trim() === "") {
      return {
        type: "none",
        data: du_ra,
      };
    }

    if (
      userStr
        .toLowerCase()
        .substring(last_child_index + 1 - du_ra.length, du_ra.length)
        .includes(du_ra.toLowerCase())
    ) {
      return {
        type: "add",
        data: du_ra,
      };
    }
  }

  //       if (index === 0) {
  //         console.log("Ben canh ----------------------------------------");
  //         console.log("lastchat ---- ", chats[index].content);
  //         console.log("data     ---- ", data);
  //         chats[index].content = data;
  //         console.log("lastchat update ---- ", chats[index].content);
  //         return {
  //           type: "change",
  //           data,
  //         };
  //       } else {
  //         console.log("KHong ben canh -----------------------------------");
  //         console.log("lastchat ---- ", chats[index].content);
  //         console.log("data     ---- ", data);
  //         console.log(
  //           "data sub string --- ",
  //           data.substring(chats[index].content.length, data.length)
  //         );
  //         const result = data.substring(chats[index].content.length, data.length);
  //         if (result.trim() !== "")
  //           return [
  //           ];

  return {
    data,
    type: "add",
  };
};
