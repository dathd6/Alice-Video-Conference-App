import "reflect-metadata";
import "dotenv-safe/config";
import { COOKIE_NAME, __prod__ } from "./constances";
import express, { json, urlencoded } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import path from "path";
import { createConnection } from "typeorm";
import textToSpeech from "@google-cloud/text-to-speech";
// import https from "https";
import http from "http";
// import fs from "fs";
import socketIO from "socket.io";

// Entities
import { User } from "./entities/User";
// Utils
// import { createUserLoader } from "./utils/createUserLoader";
// import { createUpdootLoader } from "./utils/createUpdootLoader";

// Resolvers
import { MeetResolver } from "./resolvers/meet";

import { UserResolver } from "./resolvers/user";
import { SpeechClient } from "@google-cloud/speech";
import { RelationshipResolver } from "./resolvers/relationship";
import { Relationship } from "./entities/Relationship";
import { Schedule } from "./entities/Schedule";
import { UserSchedule } from "./entities/UserSchedule";
import { ScheduleResolver } from "./resolvers/schedule";
import { Transcript } from "./entities/Transcript";
import { Document } from "./entities/Document";
import { DocumentResolver } from "./resolvers/document";
import { UserDocument } from "./entities/UserDocument";
import { NotificationResolver } from "./resolvers/notification";
import { Message } from "./entities/Message";
import { Notification } from "./entities/Notification";
import { updateInfo, uploadFile, uploadVideo } from "./utils/uploadFile";
import { voiceValidation } from "./utils/voiceValidation";
import { MessageResolver } from "./resolvers/message";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [
      User,
      Relationship,
      Schedule,
      Notification,
      Message,
      UserSchedule,
      UserDocument,
      Document,
      Transcript,
    ],
  });

  try {
    await conn.runMigrations();
  } catch (err: any) {
    console.log(err);
  }

  const app = express();
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: true }));

  let RedisStore = connectRedis(session);
  let redis = new Redis(process.env.REDIS_URL);

  // app.use("/", (_, res, next) => {
  //   res.send("Welcome to my server");
  //   next();
  // });

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".alice-meet.live" : undefined,
      },
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        MeetResolver,
        RelationshipResolver,
        ScheduleResolver,
        DocumentResolver,
        MessageResolver,
        NotificationResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      // userLoader: createUserLoader(),
      // updootLoader: createUpdootLoader(),
    }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  let server;
  // if (__prod__) {
  //   server = https.createServer(
  //     {
  //       key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
  //       cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  //     },
  //     app
  //   );
  // } else {
  server = new http.Server(app);
  // }

  //@ts-ignore
  const io = socketIO(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
    maxHttpBufferSize: 5e8,
  });

  const users: Record<string, any> = {};

  let chats: Record<string, any> = {};

  const socketToRoom: Record<string, any> = {};

  const userIdToSocket: Record<number, string> = {};

  const roomStartedTime: Record<number, any> = {};

  const roomPassword: Record<string, any> = {};

  const socketToPeerId: Record<string, any> = {};

  let recognizeStream: any = {};

  const client = new SpeechClient();
  const text_to_speech = new textToSpeech.TextToSpeechClient();

  const request = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "vi-VN",
    },
    interimResults: true,
  };

  io.on("connection", (socket: SocketIO.Socket) => {
    /**
     * User segmnet is here
     */

    socket.on("login user", (id) => {
      userIdToSocket[id] = socket.id;
      // console.log(userIdToSocket);
    });

    socket.on("notify member to join", (id, onMeeting) => {
      try {
        io.to(userIdToSocket[id]).emit(
          "notify your meeting started",
          onMeeting
        );
      } catch (err) {}
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
        io.to(userIdToSocket[notification.receiver]).emit(
          "receive notification",
          notification
        );
      } catch (err) {}
    });
    socket.on("send relationship", (id, relationship) => {
      try {
        io.to(userIdToSocket[id]).emit("receive relationship", relationship);
      } catch (err) {}
    });

    socket.on("text-to-speech", async (text) => {
      const [response] = await text_to_speech.synthesizeSpeech({
        audioConfig: {
          audioEncoding: "MP3",
        },
        input: { text },
        voice: { languageCode: "vi-VN", ssmlGender: "NEUTRAL" },
      });
      io.to(socket.id).emit("send audio", response.audioContent);
    });

    socket.on("send schedule", ({ id, schedule }) => {
      try {
        io.to(userIdToSocket[id]).emit("receive schedule", schedule);
      } catch (err) {}
    });
    socket.on("update schedule", ({ id, schedule }) => {
      try {
        io.to(userIdToSocket[id]).emit("on update schedule", schedule);
      } catch (err) {}
    });
    socket.on("delete schedule", ({ id, scheduleId }) => {
      try {
        io.to(userIdToSocket[id]).emit("on delete schedule", scheduleId);
      } catch (err) {}
    });

    socket.on("user out", (id: number) => {
      //@ts-ignore
      userIdToSocket[id] = null;
    });

    socket.on("room password authenticate", (password, id, isMeetingAuth) => {
      if (roomPassword[id] === password || isMeetingAuth) {
        io.to(socket.id).emit("room success authenticate", roomPassword[id]);
      } else {
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
    /**
     * Meeting segment is here
     */
    socket.on("join room", ({ id }, me, peerId) => {
      if (!socketToRoom[socket.id]) {
        socket.join(id);
        console.log(users[id]);
        if (users[id]) {
          // const length = users[roomID].length;
          // if (length === 4) {
          //   socket.emit("room full");
          //   return;
          // }
          users[id] = [{ ...me, socketId: socket.id }, ...users[id]];
        } else {
          users[id] = [{ ...me, socketId: socket.id }];
          chats[id] = [];
          roomStartedTime[id] = new Date();
        }
        socketToRoom[socket.id] = id;
        socketToPeerId[socket.id] = peerId;

        socket
          .to(id)
          .emit("to all users", { ...me, socketId: socket.id }, peerId);
        io.to(socket.id).emit(
          "get all users",
          users[id],
          chats[id],
          roomStartedTime[id]
        );

        // socket.to(roomID).emit("to all users", me);
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

    socket.on("chat", (chat: any) => {
      io.in(socketToRoom[socket.id]).emit("data", chat);
      chats[socketToRoom[socket.id]].push(chat);
    });

    socket.on("chatbox", (id: any, chat: any) => {
      io.to(userIdToSocket[id]).emit("receive chatbox", chat);
    });

    socket.on("chat edit", (id: number, text: string) => {
      io.in(socketToRoom[socket.id]).emit("user edit chat", id, text);
      chats[socketToRoom[socket.id]] = chats[socketToRoom[socket.id]].map(
        (props: any, index: number) => {
          if (index === id) {
            return { ...props, content: text };
          }
          return props;
        }
      );
    });

    socket.on("delete chat", (id: number) => {
      io.in(socketToRoom[socket.id]).emit("user delete chat", id);
      chats[socketToRoom[socket.id]] = chats[socketToRoom[socket.id]].filter(
        (_: any, index: number) => {
          return index !== id;
        }
      );
    });

    socket.on("upload", async (url) => {
      try {
        const file = await uploadVideo(url);
        io.to(socket.id).emit("receive url", file);
      } catch (err) {
        io.to(socket.id).emit("receive url", "");
      }
    });

    socket.on("file", async (chat: any, file: any) => {
      chat.content = await uploadFile(file, chat.content, chat.type);

      io.in(socketToRoom[socket.id]).emit("data", chat);
      chats[socketToRoom[socket.id]].push(chat);
    });

    socket.on("update", async ({ id, file, type }) => {
      try {
        const url = await updateInfo(file);
        io.to(userIdToSocket[id]).emit("receive file update", { url, type });
      } catch (err) {}
    });

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

    socket.on("speech-to-text", (data: any, user: any) => {
      // console.log(data);
      try {
        if (!recognizeStream[socket.id]) {
          console.log("INIT GOOGLE CLOUD SPEECH");
          // Create Stream to the Google Speech to Text API
          recognizeStream[socket.id] = client
            .streamingRecognize(
              //@ts-ignore
              request
            )
            .on("error", console.error)
            .on("data", (data) => {
              const result = voiceValidation(
                chats[socketToRoom[socket.id]],
                data.results[0].alternatives[0].transcript,
                user
              );
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
              } else if (result.type === "update") {
                chats[socketToRoom[socket.id]][0].content =
                  data.results[0].alternatives[0].transcript;
              }
            });
        }
      } catch (err) {
        console.log("recognizeStream", err);
      }
      try {
        if (recognizeStream[socket.id]) {
          recognizeStream[socket.id].write(data);
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter(({ socketId }: any) => {
          return socketId !== socket.id;
        });
        if (room.length === 0) {
          users[roomID] = null;
          roomStartedTime[roomID] = null;
          roomPassword[roomID] = null;
        } else users[roomID] = room;
      } else {
        roomPassword[roomID] = null;
      }

      // console.log(users[roomID]);

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

    // socket.on("stop", () => {
    //   console.log("STOP STREAMING");
    //   recognizeStream.destroy();
    //   recognizeStream = null;
    // });
  });

  server.listen(parseInt(process.env.PORT), () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((_) => {
  // console.log(err);
});
