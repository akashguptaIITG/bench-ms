const jaegerClient = require("jaeger-client");
const promClient = require("prom-client");
const initTracer = jaegerClient.initTracer;

const config = {
  serviceName: "bench-ms-aggregator-api",
  reporter: {
    collectorEndpoint:
      process.env.JAEGER_COLLECTORS_ENDPOINT ||
      "http://bench-ms-jaegerservice:14268/api/traces",
    logSpans: true,
  },
  sampler: {
    type: "const",
    param: 1,
  },
};

var namespace = config.serviceName;
const PrometheusMetricsFactory = jaegerClient.PrometheusMetricsFactory;
const metrics = new PrometheusMetricsFactory(promClient, namespace);

var options = {
  tags: {
    "bench-ms-aggregator-api": "1.0.0",
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
