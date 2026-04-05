const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");

const app = require("./index");

test("GET / returns Hello World", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const { port } = server.address();

  const response = await new Promise((resolve, reject) => {
    const request = http.get(
      {
        host: "127.0.0.1",
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
          resolve({
            body,
            statusCode: res.statusCode
          });
        });
      }
    );

    request.on("error", reject);
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, "Hello World");
});
