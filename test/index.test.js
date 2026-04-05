const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const app = require("../index");

function get(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        resolve({ statusCode: response.statusCode, body });
      });
    });

    request.on("error", reject);
  });
}

test("GET / responds with Hello World", async () => {
  const server = app.listen(0);

  try {
    await new Promise((resolve) => {
      server.once("listening", resolve);
    });

    const { port } = server.address();
    const response = await get(`http://127.0.0.1:${port}/`);

    assert.equal(response.statusCode, 200);
    assert.equal(response.body, "Hello World");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});
