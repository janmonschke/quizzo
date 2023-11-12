import type { Host } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/db.server";
import { comparePasswordAndHashe } from "~/helpers/password.server";
import { sessionStorage } from "~/services/session.server";

export const authenticator = new Authenticator<Host>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const name = form.get("name");
    const password = form.get("password");

    if (!name || !password) {
      throw new Error("Both name and password are required");
    }

    const user = await db.host.findUnique({
      where: {
        name: name.toString(),
      },
    });

    if (!user) {
      throw new Error("Could not find user");
    }

    const isCorrectPassword = await comparePasswordAndHashe(
      password.toString(),
      user.passwordHash
    );

    if (!isCorrectPassword) {
      throw new Error("Wrong password");
    }

    return user;
  }),
  "user-pass"
);
