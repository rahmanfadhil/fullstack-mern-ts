import * as express from "express";
import * as passport from "passport";
import {
  userLoginWithGoogle,
  getCurrentUser,
  userLogout
} from "../controllers/user.controller";
const router = express.Router();

// @access: public
// @desc: Login with e-mail
router.post("/login/email", passport.authenticate("local"), (req, res) =>
  res.send({ data: req.user })
);

// @access: public
// @desc: Login with google
router.get("/login/google", userLoginWithGoogle);

// @access: private
// @desc: Get current user
router.get("/current", getCurrentUser);

// @access: public
// @desc: Logout current user
router.post("/logout", userLogout);

export default router;
