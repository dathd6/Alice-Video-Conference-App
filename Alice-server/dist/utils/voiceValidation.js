"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceValidation = void 0;
const voiceValidation = (chats, data, user) => {
    let userStr = "";
    let userArr = chats
        .map((chat, index) => (Object.assign(Object.assign({}, chat), { stt: index })))
        .filter((chat) => {
        if (chat.type === "voice" && chat.username === user.fullname) {
            userStr += chat.content.toLowerCase();
            return true;
        }
        return false;
    });
    let last_child_index = userArr.length - 1;
    if (userStr
        .toLowerCase()
        .substring(last_child_index + 1 - data.length, data.length)
        .includes(data.toLowerCase())) {
        return {
            type: "none",
            data,
        };
    }
    if (last_child_index >= 0 &&
        data.toLowerCase().includes(userArr[last_child_index].content.toLowerCase())) {
        const lastChild = userArr[last_child_index].content.toLowerCase();
        if (data.toLowerCase().indexOf(lastChild) === 0 &&
            userArr[last_child_index].stt === chats.length - 1) {
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
        console.log(userStr
            .toLowerCase()
            .substring(last_child_index + 1 - du_ra.length, du_ra.length));
        if (du_ra.trim() === "") {
            return {
                type: "none",
                data: du_ra,
            };
        }
        if (userStr
            .toLowerCase()
            .substring(last_child_index + 1 - du_ra.length, du_ra.length)
            .includes(du_ra.toLowerCase())) {
            return {
                type: "add",
                data: du_ra,
            };
        }
    }
    return {
        data,
        type: "add",
    };
};
exports.voiceValidation = voiceValidation;
//# sourceMappingURL=voiceValidation.js.map