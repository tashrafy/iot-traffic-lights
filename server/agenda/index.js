import { v4 as uuidv4 } from 'uuid';
import Agenda from "agenda";
import config from "../config/environment";

import * as toggleLightsJob from './toggle-lights-job';
import { scheduleReoccurringJob } from "./utilities";

const moment = require("moment");
require("moment-timezone");

const agenda = new Agenda({
  db: {
    address: config.mongo.uri,
  },
});

agenda.on("ready", () => {
  console.log('AGENDA INITIALIZED: IOT TRAFFIC LIGHTS');
  const initJobName = "Initialize Traffic Lights";

  agenda.defaultConcurrency(50);

  agenda.define(initJobName, async function(job, done) {
    const userId = process.env.UUID || uuidv4();

    if (config.hue.enabled) {
      await scheduleReoccurringJob(toggleLightsJob.jobName, "6 seconds", "America/New_York", userId);
    }

    done();
  });

  agenda.define(toggleLightsJob.jobName, toggleLightsJob.jobHandler);

  agenda.now(initJobName);

  agenda.on("start", (job) => {
    // log necessary info
  });

  agenda.on("success", (job) => {
    // log necessary info
  });
  agenda.on("fail", (err, job) => {
    // log necessary info
  });
});

function graceful() {
  agenda.stop(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", graceful);
process.on("SIGINT" , graceful);

export {agenda};
