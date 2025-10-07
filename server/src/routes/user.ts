import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

import {
  createUser,
  deleteUser,
  findUserByNameOrEmail,
  verifyUser,
} from "../crud/users";
import { JWT_SECRET } from "../constants";
import { createReferral } from "../crud/referrals";

export const user = new Elysia({ prefix: "/user" })
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
      schema: t.Object({
        id: t.String(),
        refCode: t.String(),
      }),
    })
  )
  .post(
    "/register",
    async ({ body, set, query: { ref } }) => {
      try {
        const { referred, ...userParams } = body;
        const { name, email } = userParams;

        const existingName = await findUserByNameOrEmail(name);
        const existingEmail = await findUserByNameOrEmail(email);
        if (existingName || existingEmail) {
          set.status = 400;
          return { error: "User with this name or email already exists" };
        }

        const user = await createUser(userParams);
        set.status = 201;

        if (ref) {
          await createReferral({
            refCode: ref,
            followedThrough: true,
          });
        }

        return {
          message: "User created successfully",
          user,
        };
      } catch (error) {
        console.log(error);
        set.status = 500;
        return { error: "Internal server error" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        pwd: t.String({ minLength: 8 }),
        referred: t.Boolean(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set, jwt, cookie: { auth } }) => {
      try {
        const user = await verifyUser(body.identifier, body.pwd);

        if (!user) {
          set.status = 401;
          return { error: "Invalid username or password" };
        }

        const value = await jwt.sign({
          id: user.id,
          refCode: user.refCode,
        });

        auth.set({
          value: value,
          httpOnly: true,
          maxAge: 7 * 86400, // 7 days
          path: "/",
        });

        return {
          message: "Login successful",
          user,
        };
      } catch (error) {
        set.status = 500;
        return { error: "Internal server error" };
      }
    },
    {
      body: t.Object({
        identifier: t.String(),
        pwd: t.String(),
      }),
    }
  )
  .post("/logout", ({ cookie: { auth }, set }) => {
    auth.remove();
    set.status = 200;
    return { message: "Logout successful" };
  })
  .delete("/", async ({ jwt, cookie: { auth }, set }) => {
    try {
      const token = auth.value;
      if (!token) {
        set.status = 401;
        return { error: "Not authenticated" };
      }

      const payload = await jwt.verify(auth.value as string);
      if (!payload) {
        set.status = 401;
        return { error: "Invalid token" };
      }

      const deletedUser = await deleteUser(payload.id);
      auth.remove();

      return {
        message: "User deleted successfully",
        user: deletedUser,
      };
    } catch (error) {
      console.log(error);
      set.status = 500;
      return { error: "Internal server error" };
    }
  });
