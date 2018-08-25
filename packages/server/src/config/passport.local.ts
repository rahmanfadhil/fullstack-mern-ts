import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { Request } from "express";
import { User } from "../entity/User";
import { Strategy } from "passport-local";

export default passport => {
  passport.use(
    new Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
        session: true
      },
      async (req: Request, email: string, password: string, done) => {
        if (!email || !password) return done("E-Mail and Password is required");
        const checkUser = await User.findOne({ where: { email } });
        if (req.body.register === true) {
          if (checkUser) return done("E-Mail already exist!");
          if (!req.body.full_name) return done("You must have a name");
          const hash = hashSync(password, genSaltSync(10));
          const data = await User.create({
            full_name: req.body.full_name,
            email,
            password: hash
          }).save();
          done(null, data);
        } else {
          if (!checkUser) return done("E-Mail is not exist");
          const result = compareSync(password, checkUser.password);
          if (!result) return done("Password invalid!");
          done(null, checkUser);
        }
      }
    )
  );
};
