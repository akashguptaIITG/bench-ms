require("dotenv").config();
const { tracer } = require("./jaeger");
const express = require("express");
const { Tags, FORMAT_HTTP_HEADERS } = require("opentracing");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// enabling cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// get the client

// create the connection to database
const db = mysql.createConnection({
  host: process.env.DB_HOST || process.env.DB_DEVHOST,
  user: process.env.DB_USER || process.env.DB_DEVUSER,
  password: process.env.DB_PASSWORD || process.env.DB_DEVPASSWORD,
  database: "benchms",
});

app.get("/user/:userId", async (req, res) => {
  let traceContext = {};
  const parentSpanContext = tracer.extract(
    FORMAT_HTTP_HEADERS,
    req.body.traceContext
  );
  console.log(parentSpanContext);
  const span = tracer.startSpan(`HTTP GET`, {
    childOf: parentSpanContext,
    tags: {
      [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER,
      [Tags.HTTP_URL]: req.url,
      [Tags.HTTP_METHOD]: req.method,
    },
  });

  tracer.inject(span, FORMAT_HTTP_HEADERS, traceContext);
  let { userId } = req.params;
  console.log(userId);
  let [
    user,
    field,
  ] = await db
    .promise()
    .execute("SELECT * FROM user WHERE Id=? LIMIT 1", [userId]);
  if (user && user.length > 0) {
    // making a deep copy
    user = JSON.parse(JSON.stringify(user[0]));
    delete user.userId;
    span.setTag(Tags.HTTP_STATUS_CODE, 200);
    span.finish();
    res.json(user);
  } else {
    span.setTag(Tags.HTTP_STATUS_CODE, 404);
    span.finish();
    res.sendStatus(404);
  }
});

app.listen(7001, () => {
  console.log("server is running on port", 7001);
});
