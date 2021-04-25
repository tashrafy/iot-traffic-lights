import axios from 'axios';
import Hue from './hue.model';
import { hue } from '../../config/environment';

export async function getAll(req, res) {
  const endpoint = `${hue.domain}/api/newdeveloper/lights`;

  try {
    const response = await axios.get(endpoint);
    const data = response.data;

    return res.json(data);
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message);
  }
}

export async function modifyState(req, res) {
  const endpoint = `${hue.domain}/api/newdeveloper/lights`;
  console.log(req.body);
  try {
    const response = await axios.put(`${endpoint}/1/state`, {
      on: true,
      hue: req.body.hue || 10000,
      bri: (req.body.bri || 100) + 100
    });
    const data = response.data;

    return res.json(data);
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message);
  }
}
