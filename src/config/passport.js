import local from "passport-local"; //Ésta sería la estrategia
import passport from "passport"; //Manejador de la estrategia
import GithubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import { userModel } from "../models/users.model.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: email });
          if (user) {
            done(null, false);
          } else {
            const hashPassword = createHash(password);
            const createdUser = await userModel.create({
              firstName: firstName,
              lastName: lastName,
              email: email,
              age: age,
              password: hashPassword,
            });
            console.log(createdUser);
            return done(null, createdUser);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: email });

          if (!user) {
            return done(null, false);
          }

          if (validatePassword(password)) {
            return done(null, user); //Si cumple ambos, el usuario es válido
          }

          return done(null, false); // Si alguno de los dos casos es false, el login será erróneo
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(accessToken)
            console.log(refreshToken)
          const user = await userModel.findOne({ email: profile._json.email });
          if (user) {
            done(null, false);
          } else {
            const userCreated = await userModel.create({
                firstName: profile._json.name,
                lastName: ' ',
                email: profile._json.email,
                age: 18, // Por default
                password: 'password'

            });
            done(null, userCreated);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
