const jaegerClient = require("jaeger-client");
const promClient = require("prom-client");
const initTracer = jaegerClient.initTracer;

const config = {
  serviceName: "bench-ms-user-api",
  reporter: {
    collectorEndpoint:
      process.env.JAEGER_COLLECTORS_ENDPOINT ||
      "http://bench-ms-jaeger-service:14268/api/traces",
    logSpans: true,
  },
  sampler: {
    type: "const",
    param: 0,
  },
};

var namespace = config.serviceName;
const PrometheusMetricsFactory = jaegerClient.PrometheusMetricsFactory;
const metrics = new PrometheusMetricsFactory(promClient, namespace);

var options = {
  tags: {
    "bench-ms-user-api": "1.0.0",
  },
  logger: {
    info(msg) {
      console.log("INFO ", msg);
    },
    error(msg) {
      console.log("ERROR", msg);
    },
    metrics: metrics,
  },
};
const tracer = initTracer(config, options);
module.exports = {
  tracer,
};
