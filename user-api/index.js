const { tracer } = require("./jaeger");
const express = require("express");
const { Tags, FORMAT_HTTP_HEADERS } = require("opentracing");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const users = require("./data");
// enabling cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/user/:userId", (req, res) => {
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
  let user = users.find((x) => x.userId == userId);
  if (user) {
    // making a deep copy
    user = JSON.parse(JSON.stringify(user));
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
