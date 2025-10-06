import { Elysia } from "elysia";
import cors from "@elysiajs/cors";

import { auth } from "./routes/auth";

import { NODE_ENV } from "./constants";

export const app = new Elysia()
  .use(cors())
  .onRequest(({ request }) => {
    if (NODE_ENV == "development") console.log(request.method, request.url);
  })
  .use(auth)
  .get("/", () => {
    return "OK";
  });
