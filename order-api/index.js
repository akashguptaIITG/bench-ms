const { tracer } = require("./jaeger");
const { Tags, FORMAT_HTTP_HEADERS } = require("opentracing");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const orders = require("./data");
// enabling cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/orders/:userId", (req, res) => {
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
  let userOrders = orders.filter((x) => x.userId == userId);
  if (userOrders.length > 0) {
    //deep copy
    userOrders = JSON.parse(JSON.stringify(userOrders));
    userOrders.map((uo) => delete uo.userId);
    span.setTag(Tags.HTTP_STATUS_CODE, 200);
    span.finish();
    res.json(userOrders);
  } else {
    span.setTag(Tags.HTTP_STATUS_CODE, 404);
    span.finish();
    res.sendStatus(404);
  }
});

app.listen(7002, () => {
  console.log("server is running on port", 7002);
});
