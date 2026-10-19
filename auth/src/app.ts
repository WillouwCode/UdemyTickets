import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "../../auth/src/routes/currentUser";
import { signInRouter } from "../../auth/src/routes/signIn";
import { signUpRouter } from "../../auth/src/routes/signUp";
import { signOutRouter } from "../../auth/src/routes/signOut";
import { errorHandler, NotFoundError } from "@pint_mushy/common";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== "test"
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };