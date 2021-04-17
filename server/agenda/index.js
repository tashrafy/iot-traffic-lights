import Agenda from "agenda";
import {each, isEmpty} from "lodash";
import config from "../config/environment";
import axios from 'axios';

const moment = require("moment");
require("moment-timezone");

const agenda = new Agenda({
  db: {
    address: config.mongo.uri,
  },
});

async function scheduleReoccurringJob(name, interval, timezone, data) {
  const job = agenda.create(name, data);
  job.repeatEvery(interval, {
    timezone,
  });
  job.computeNextRunAt();
  await job.save();
}

agenda.on("ready", () => {
  agenda.defaultConcurrency(50);

  agenda.define("Initialize Capture", async function(job, done) {
    const { data: lights } = await axios.get("http://localhost:9000/api/hue/lights");
    const { data: devices } = await axios.get("http://localhost:9000/api/iot-inspector/subscribe");

    await scheduleReoccurringJob("Collect Traffic", "15 seconds", "America/New_York");
    done();
  });

  agenda.define("Collect Traffic", async function(job, done) {
    const { data: traffic } = await axios.get("http://localhost:9000/api/iot-inspector/get_traffic");

    done();
  })

  agenda.now("Initialize Capture");

  agenda.on("start", (job) => {
    // log necessary info
  });

  agenda.on("success", (job) => {
    // log necessary info
  });
  agenda.on("fail", (err, job) => {
    // log necessary info
  });

  // agenda.cancel({name: cleanUpJob.jobName}, () => {
  //   agenda.every("0 0 * * *", cleanUpJob.jobName);
  // });

  if (config.env === "production") {
    // agenda.cancel({name: clientJobSchedulerJob.jobName}, () => {
    //   agenda.every("0 0 * * *", clientJobSchedulerJob.jobName);
    // });
  }
});

function graceful() {
  agenda.stop(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", graceful);
process.on("SIGINT" , graceful);

export {agenda};
