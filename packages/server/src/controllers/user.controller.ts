import { RequestHandler } from "express";

export const userLoginWithGoogle: RequestHandler = (req, res) => {
  res.send("LOGIN USER");
};

export const getCurrentUser: RequestHandler = (req, res) => {
  if (req.user) return res.send({ data: req.user });
  res.send({ error: "You are not logged in" });
};

export const userLogout: RequestHandler = (req, res) => {
  req.logout();
  res.send({ data: true });
};
