"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = exports.uploadFile = exports.updateInfo = void 0;
const transloadit_1 = __importDefault(require("transloadit"));
const updateInfo = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const transloadit = new transloadit_1.default({
        authKey: process.env.TRANSLOADIT_AUTH_KEY,
        authSecret: process.env.TRANSLOADIT_AUTH_SECRET,
    });
    const robot = "/image/optimize";
    let uploads = {};
    uploads[`${"avatar or banner"}`] = file;
    try {
        const status = yield transloadit.createAssembly({
            uploads,
            params: {
                steps: {
                    resize: {
                        use: ":original",
                        robot,
                        result: true,
                    },
                },
            },
            waitForCompletion: true,
        });
        if (status.results.resize) {
            console.log("file url", status.results.resize[0].ssl_url);
            return status.results.resize[0].ssl_url;
        }
        else {
            return "";
        }
    }
    catch (err) {
        console.error("❌ Unable to process Assembly.", err);
        if (err.assemblyId) {
            console.error(`💡 More info: https://transloadit.com/assemblies/${err.assemblyId}`);
        }
        return "";
    }
});
exports.updateInfo = updateInfo;
const uploadFile = (file, fileName, type) => __awaiter(void 0, void 0, void 0, function* () {
    const transloadit = new transloadit_1.default({
        authKey: process.env.TRANSLOADIT_AUTH_KEY,
        authSecret: process.env.TRANSLOADIT_AUTH_SECRET,
    });
    const robot = type === "video"
        ? "/video/encode"
        : type === "image"
            ? "/image/optimize"
            : "/document/convert";
    let uploads = {};
    uploads[`${fileName}`] = file;
    let tail = fileName.split(".")[fileName.split(".").length - 1];
    console.log(tail, type);
    try {
        const status = yield transloadit.createAssembly({
            uploads,
            params: {
                steps: {
                    resize: {
                        use: ":original",
                        robot,
                        format: type === "application" ? tail : null,
                        result: true,
                    },
                },
            },
            waitForCompletion: true,
        });
        if (status.results.resize) {
            console.log("file url", status.results.resize[0].ssl_url);
            return status.results.resize[0].ssl_url;
        }
        else {
            return "";
        }
    }
    catch (err) {
        console.error("❌ Unable to process Assembly.", err);
        if (err.assemblyId) {
            console.error(`💡 More info: https://transloadit.com/assemblies/${err.assemblyId}`);
        }
        return "";
    }
});
exports.uploadFile = uploadFile;
const uploadVideo = (url) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(url);
    const transloadit = new transloadit_1.default({
        authKey: process.env.TRANSLOADIT_AUTH_KEY,
        authSecret: process.env.TRANSLOADIT_AUTH_SECRET,
    });
    const robot = "/video/encode";
    try {
        const status = yield transloadit.createAssembly({
            uploads: {
                video: url,
            },
            params: {
                steps: {
                    resize: {
                        use: ":original",
                        robot,
                        preset: "webm",
                        tubro: false,
                        result: true,
                    },
                },
            },
            waitForCompletion: true,
        });
        if (status.results.resize) {
            console.log("file url", status.results.resize[0].ssl_url);
            return status.results.resize[0].ssl_url;
        }
        else {
            return "";
        }
    }
    catch (err) {
        console.error("❌ Unable to process Assembly.", err);
        if (err.assemblyId) {
            console.error(`💡 More info: https://transloadit.com/assemblies/${err.assemblyId}`);
        }
        return "";
    }
});
exports.uploadVideo = uploadVideo;
//# sourceMappingURL=uploadFile.js.map