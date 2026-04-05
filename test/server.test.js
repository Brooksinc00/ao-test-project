const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const app = require("../index");

test("GET / returns Hello World", async () => {
  const server = app.listen(0);

  await new Promise((resolve) => server.once("listening", resolve));

  const { port } = server.address();

  const response = await new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: "127.0.0.1",
        port,
        path: "/"
      },
      (res) => {
        let body = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode, body });
        });
      }
    );

    req.on("error", reject);
  });

  server.close();

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, "Hello World");
});
