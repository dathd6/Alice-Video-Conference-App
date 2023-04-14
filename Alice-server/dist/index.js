"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("reflect-metadata");
require("dotenv-safe/config");
const constances_1 = require("./constances");
const express_1 = __importStar(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const text_to_speech_1 = __importDefault(require("@google-cloud/text-to-speech"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const User_1 = require("./entities/User");
const meet_1 = require("./resolvers/meet");
const user_1 = require("./resolvers/user");
const speech_1 = require("@google-cloud/speech");
const relationship_1 = require("./resolvers/relationship");
const Relationship_1 = require("./entities/Relationship");
const Schedule_1 = require("./entities/Schedule");
const UserSchedule_1 = require("./entities/UserSchedule");
const schedule_1 = require("./resolvers/schedule");
const Transcript_1 = require("./entities/Transcript");
const Document_1 = require("./entities/Document");
const document_1 = require("./resolvers/document");
const UserDocument_1 = require("./entities/UserDocument");
const notification_1 = require("./resolvers/notification");
const Message_1 = require("./entities/Message");
const Notification_1 = require("./entities/Notification");
const uploadFile_1 = require("./utils/uploadFile");
const voiceValidation_1 = require("./utils/voiceValidation");
const message_1 = require("./resolvers/message");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield typeorm_1.createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [
            User_1.User,
            Relationship_1.Relationship,
            Schedule_1.Schedule,
            Notification_1.Notification,
            Message_1.Message,
            UserSchedule_1.UserSchedule,
            UserDocument_1.UserDocument,
            Document_1.Document,
            Transcript_1.Transcript,
        ],
    });
    try {
        yield conn.runMigrations();
    }
    catch (err) {
        console.log(err);
    }
    const app = express_1.default();
    app.use(express_1.json({ limit: "50mb" }));
    app.use(express_1.urlencoded({ limit: "50mb", extended: true }));
    let RedisStore = connect_redis_1.default(express_session_1.default);
    let redis = new ioredis_1.default(process.env.REDIS_URL);
    app.set("trust proxy", 1);
    app.use(cors_1.default({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));
    app.use(function (_, res, next) {
        res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(express_session_1.default({
        name: constances_1.COOKIE_NAME,
        store: new RedisStore({ client: redis, disableTouch: true }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constances_1.__prod__,
            domain: constances_1.__prod__ ? ".alice-meet.live" : undefined,
        },
        saveUninitialized: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [
                user_1.UserResolver,
                meet_1.MeetResolver,
                relationship_1.RelationshipResolver,
                schedule_1.ScheduleResolver,
                document_1.DocumentResolver,
                message_1.MessageResolver,
                notification_1.NotificationResolver,
            ],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
        }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    let server;
    server = new http_1.default.Server(app);
    const io = socket_io_1.default(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true,
        },
        maxHttpBufferSize: 5e8,
    });
    const users = {};
    let chats = {};
    const socketToRoom = {};
    const userIdToSocket = {};
    const roomStartedTime = {};
    const roomPassword = {};
    const socketToPeerId = {};
    let recognizeStream = {};
    const client = new speech_1.SpeechClient();
    const text_to_speech = new text_to_speech_1.default.TextToSpeechClient();
    const request = {
        config: {
            encoding: "LINEAR16",
            sampleRateHertz: 16000,
            languageCode: "vi-VN",
        },
        interimResults: true,
    };
    io.on("connection", (socket) => {
        socket.on("login user", (id) => {
            userIdToSocket[id] = socket.id;
        });
        socket.on("notify member to join", (id, onMeeting) => {
            try {
                io.to(userIdToSocket[id]).emit("notify your meeting started", onMeeting);
            }
            catch (err) { }
        });
        socket.on("mute user", (socketId) => {
            io.to(socketId).emit("on mute");
        });
        socket.on("kick user", (socketId) => {
            io.to(socketId).emit("on kick");
        });
        socket.on("unshare user", (socketId) => {
            io.to(socketId).emit("on unshare");
        });
        socket.on("send notification", (notification) => {
            try {
                io.to(userIdToSocket[notification.receiver]).emit("receive notification", notification);
            }
            catch (err) { }
        });
        socket.on("send relationship", (id, relationship) => {
            try {
                io.to(userIdToSocket[id]).emit("receive relationship", relationship);
            }
            catch (err) { }
        });
        socket.on("text-to-speech", (text) => __awaiter(void 0, void 0, void 0, function* () {
            const [response] = yield text_to_speech.synthesizeSpeech({
                audioConfig: {
                    audioEncoding: "MP3",
                },
                input: { text },
                voice: { languageCode: "vi-VN", ssmlGender: "NEUTRAL" },
            });
            io.to(socket.id).emit("send audio", response.audioContent);
        }));
        socket.on("send schedule", ({ id, schedule }) => {
            try {
                io.to(userIdToSocket[id]).emit("receive schedule", schedule);
            }
            catch (err) { }
        });
        socket.on("update schedule", ({ id, schedule }) => {
            try {
                io.to(userIdToSocket[id]).emit("on update schedule", schedule);
            }
            catch (err) { }
        });
        socket.on("delete schedule", ({ id, scheduleId }) => {
            try {
                io.to(userIdToSocket[id]).emit("on delete schedule", scheduleId);
            }
            catch (err) { }
        });
        socket.on("user out", (id) => {
            userIdToSocket[id] = null;
        });
        socket.on("room password authenticate", (password, id, isMeetingAuth) => {
            if (true || roomPassword[id] === password || isMeetingAuth) {
                console.log(isMeetingAuth, password, roomPassword[id]);
                io.to(socket.id).emit("room success authenticate", roomPassword[id]);
            }
            else {
                io.to(socket.id).emit("room error authenticate", roomPassword[id]);
            }
        });
        socket.on("init room password", ({ id }) => {
            if (!socketToRoom[socket.id]) {
                let isNew = false;
                if (!roomPassword[id]) {
                    roomPassword[id] = Math.random().toString(36).substr(2, 8);
                    isNew = true;
                }
                socket.emit("send back room password", {
                    password: roomPassword[id],
                    isNew,
                });
            }
        });
        socket.on("join room", ({ id }, me, peerId) => {
            if (!socketToRoom[socket.id]) {
                socket.join(id);
                console.log(users[id]);
                if (users[id]) {
                    users[id] = [Object.assign(Object.assign({}, me), { socketId: socket.id }), ...users[id]];
                }
                else {
                    users[id] = [Object.assign(Object.assign({}, me), { socketId: socket.id })];
                    chats[id] = [];
                    roomStartedTime[id] = new Date();
                }
                socketToRoom[socket.id] = id;
                socketToPeerId[socket.id] = peerId;
                socket
                    .to(id)
                    .emit("to all users", Object.assign(Object.assign({}, me), { socketId: socket.id }), peerId);
                io.to(socket.id).emit("get all users", users[id], chats[id], roomStartedTime[id]);
            }
        });
        socket.on("sending signal", (payload) => {
            io.to(payload.userToSignal).emit("user joined", {
                signal: payload.signal,
                callerID: payload.callerID,
            });
        });
        socket.on("returning signal", (payload) => {
            io.to(payload.callerID).emit("receiving returned signal", {
                signal: payload.signal,
                id: socket.id,
            });
        });
        socket.on("chat", (chat) => {
            io.in(socketToRoom[socket.id]).emit("data", chat);
            chats[socketToRoom[socket.id]].push(chat);
        });
        socket.on("chatbox", (id, chat) => {
            io.to(userIdToSocket[id]).emit("receive chatbox", chat);
        });
        socket.on("chat edit", (id, text) => {
            io.in(socketToRoom[socket.id]).emit("user edit chat", id, text);
            chats[socketToRoom[socket.id]] = chats[socketToRoom[socket.id]].map((props, index) => {
                if (index === id) {
                    return Object.assign(Object.assign({}, props), { content: text });
                }
                return props;
            });
        });
        socket.on("delete chat", (id) => {
            io.in(socketToRoom[socket.id]).emit("user delete chat", id);
            chats[socketToRoom[socket.id]] = chats[socketToRoom[socket.id]].filter((_, index) => {
                return index !== id;
            });
        });
        socket.on("upload", (url) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const file = yield uploadFile_1.uploadVideo(url);
                io.to(socket.id).emit("receive url", file);
            }
            catch (err) {
                io.to(socket.id).emit("receive url", "");
            }
        }));
        socket.on("file", (chat, file) => __awaiter(void 0, void 0, void 0, function* () {
            chat.content = yield uploadFile_1.uploadFile(file, chat.content, chat.type);
            io.in(socketToRoom[socket.id]).emit("data", chat);
            chats[socketToRoom[socket.id]].push(chat);
        }));
        socket.on("update", ({ id, file, type }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const url = yield uploadFile_1.updateInfo(file);
                io.to(userIdToSocket[id]).emit("receive file update", { url, type });
            }
            catch (err) { }
        }));
        socket.on("pause speech-to-text", () => {
            if (recognizeStream[socket.id]) {
                recognizeStream[socket.id].pause();
            }
        });
        socket.on("resume speech-to-text", () => {
            if (recognizeStream[socket.id]) {
                recognizeStream[socket.id].resume();
            }
        });
        socket.on("speech-to-text", (data, user) => {
            try {
                if (!recognizeStream[socket.id]) {
                    console.log("INIT GOOGLE CLOUD SPEECH");
                    recognizeStream[socket.id] = client
                        .streamingRecognize(request)
                        .on("error", console.error)
                        .on("data", (data) => {
                        const result = voiceValidation_1.voiceValidation(chats[socketToRoom[socket.id]], data.results[0].alternatives[0].transcript, user);
                        if (result.type !== "none") {
                            io.in(socketToRoom[socket.id]).emit("data", result, user);
                        }
                        if (result.type === "add") {
                            chats[socketToRoom[socket.id]].push({
                                id: user.id,
                                username: user.fullname,
                                avatar: user.avatar,
                                content: data.results[0].alternatives[0].transcript,
                                type: "voice",
                                time: new Date(),
                            });
                        }
                        else if (result.type === "update") {
                            chats[socketToRoom[socket.id]][0].content =
                                data.results[0].alternatives[0].transcript;
                        }
                    });
                }
            }
            catch (err) {
                console.log("recognizeStream", err);
            }
            try {
                if (recognizeStream[socket.id]) {
                    recognizeStream[socket.id].write(data);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
        socket.on("disconnect", () => {
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                room = room.filter(({ socketId }) => {
                    return socketId !== socket.id;
                });
                if (room.length === 0) {
                    users[roomID] = null;
                    roomStartedTime[roomID] = null;
                    roomPassword[roomID] = null;
                }
                else
                    users[roomID] = room;
            }
            else {
                roomPassword[roomID] = null;
            }
            socket
                .to(socketToRoom[socket.id])
                .emit("user out", socketToPeerId[socket.id], socket.id);
            if (recognizeStream[socket.id]) {
                recognizeStream[socket.id].destroy();
                recognizeStream[socket.id] = null;
            }
            socketToPeerId[socket.id] = null;
            socketToRoom[socket.id] = null;
            socket.disconnect();
        });
    });
    server.listen(parseInt(process.env.PORT), () => {
        console.log("server started on localhost:4000");
    });
});
main().catch((_) => {
});
//# sourceMappingURL=index.js.map