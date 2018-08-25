import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyparser from "body-parser";
import * as session from "express-session";
import * as passport from "passport";
import * as morgan from "morgan";
import * as prettyError from "pretty-error";
import userRoutes from "./routes/user.routes";

import { dbConfig, getRedisStore } from "./setup";
import passportLocalConfig from "./config/passport.local";
import { User } from "./entity/User";

if (process.env.NODE_ENV !== "production") prettyError.start();

createConnection(dbConfig).then(connection => {
  console.log("[database] connected!");
  const app = express();

  // Passport configs
  passportLocalConfig(passport);

  // Passport serializing
  passport.serializeUser((user: User, cb) => {
    cb(null, user.id);
  });

  // Passport deserializing
  passport.deserializeUser(async (id: number, cb) => {
    const data = await User.findOne({ where: { id } });
    cb(null, data);
  });

  // Express middlewares
  app.use(morgan("dev"));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret",
      store: getRedisStore(session),
      saveUninitialized: true,
      resave: true
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Register api
  app.use("/api/v1/user", userRoutes);

  // Start server
  app.listen(4000, () => console.log("[server] listening ..."));
});
