import axios from 'axios';
import IoTInspector from './iot-inspector.model';
import { hue, iotInspector } from '../../config/environment';

export async function susbcribeDevices(req, res) {
  try {
    const response = await axios.get(`${iotInspector.domain}/get_device_list`);
    const data = response.data;
    const devices = [];

    for (const key in data) {
      devices.push(key);
      await axios.get(`${iotInspector.domain}/enable_inspection/${key}`);
    }

    return res.json(devices);
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message);
  }
}

export async function getTraffic(req, res) {
  try {
    const response = await axios.get(`${iotInspector.domain}/get_traffic`);
    const data = response.data;
    const devices = [];

    for (const key in data) {
      devices.push(key);
    }

    return res.json(devices);
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message);
  }
}
