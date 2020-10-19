const { tracer } = require("./jaeger");
const { Tags, FORMAT_HTTP_HEADERS } = require("opentracing");
const express = require("express");
const app = express();
const cors = require("cors");
const request = require("request-promise");
const bodyParser = require("body-parser");
const USER_API_URL = process.env.USER_API_URL || "http://localhost:7001";
const ORDERS_API_URL = process.env.ORDERS_API_URL || "http://localhost:7002";

// enabling cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/orderdetails/:userId", async (req, res) => {
  try {
    let traceContext = {};
    const span = tracer.startSpan("HTTP GET");
    span.setTag(Tags.HTTP_URL, req.url);
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
    // Send span context via request headers (parent id etc.)
    tracer.inject(span, FORMAT_HTTP_HEADERS, traceContext);
    let { userId } = req.params;
    console.log(userId);
    let userDetails = await request.get(`${USER_API_URL}/user/${userId}`, {
      json: true,
      body: { traceContext },
    });
    let orders = await request.get(`${ORDERS_API_URL}/orders/${userId}`, {
      json: true,
      body: { traceContext },
    });
    if (userDetails) {
      span.setTag(Tags.HTTP_STATUS_CODE, 200);
      span.finish();
      res.json({ userDetails, orders });
    } else {
      span.setTag(Tags.HTTP_STATUS_CODE, 404);
      span.finish();
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(7003, () => {
  console.log("server is running on port", 7003);
});
