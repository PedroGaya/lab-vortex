import { Elysia } from "elysia";
import cors from "@elysiajs/cors";

import { user } from "./routes/user";

import { NODE_ENV } from "./constants";

export const app = new Elysia()
  .use(cors())
  .onRequest(({ request }) => {
    if (NODE_ENV == "development") console.log(request.method, request.url);
  })
  .use(user)
  .get("/", () => {
    return "OK";
  });
