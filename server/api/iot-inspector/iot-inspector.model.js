import mongoose from 'mongoose';

var IoTInspectorSchema = new mongoose.Schema({
  name: {
    type: String
  },
  rate: {
    type: Number
  }
});

export default mongoose.model('IoTInspector', IoTInspectorSchema);
