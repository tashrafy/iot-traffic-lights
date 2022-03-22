import axios from 'axios';
import config from "../config/environment";
import { hueMap, getTrackingData } from "./utilities";
const ENDPOINT = `http://${config.domain}:${config.port}`;

const moment = require("moment");
require("moment-timezone");

const jobName = "Toggle Traffic Lights";

async function jobHandler(job, done) {
  const { trackingTraffic, regularTraffic } = await getTrackingData(job.attrs.data);

  console.log("toggling traffic lights");

  if (trackingTraffic) {
    console.log("trackingTraffic", trackingTraffic);
    await axios.post(`${ENDPOINT}/api/hue/modify_state`, {
      hue: 0,
      bri: (trackingTraffic.outboundBytesTotal.$numberDecimal / 1000) * 154
    });
  } else if (regularTraffic) {
    console.log("regularTraffic", regularTraffic);
    const hue = hueMap[regularTraffic._id.protocol] || 10000;
    await axios.post(`${ENDPOINT}/api/hue/modify_state`, {
      hue,
      bri: (regularTraffic.outboundBytesTotal.$numberDecimal / 10000) * 154
    });
  }

  done();
}

export {jobName, jobHandler};
