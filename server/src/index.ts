import { APP_HOST, APP_PORT } from "./constants";
import { app } from "./app";

app.listen(
  {
    hostname: APP_HOST,
    port: APP_PORT,
  },
  ({ hostname, port }) => {
    console.info(`Running at http://${hostname}:${port}`);
  }
);
