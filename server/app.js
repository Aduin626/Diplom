import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import morgan from "morgan";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import { jwtTokens } from "./utils/jwt.helpers.js";
import multer from 'multer';

import authRouter from "./routes/auth.js";
import patientRouter from "./routes/patient.js";
import doctorRouter from "./routes/doctor.js";
import adminRouter from "./routes/admin.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

dotenv.config();

//Рандомная генерация токенов
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const access_token_secret = generateRandomToken();
const refresh_token_secret = generateRandomToken();
const corsOption = { credential: true, origin: process.env.URL || "*" };
//Запись токинов в файл
fs.writeFileSync(
  ".env",
  `ACCESS_TOKEN_SECRET=${access_token_secret}\nREFRESH_TOKEN_SECRET=${refresh_token_secret}`
);

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    
    res.status(400).send({ message: error.message });
  } else {
    next(error);
  }
});

io.use((socket, next) => {
  const token = socket.handshake.query?.token;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  console.log("a user connected");
  // Здесь вы можете использовать socket.decoded для получения информации о пользователе
});
export default app;
