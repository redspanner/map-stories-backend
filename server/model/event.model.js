const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
  type: String,
  url: String,
  urlImg: String,
  title: String,
  text: String,
});

const eventSchema = new Schema({
  title: String,
  startTime: String,
  dateAndTime: String,
  mapLocation: String,
  location: {
    lat: String,
    lng: String,
  },
  attachments: [attachmentSchema],
});

const Event = mongoose.model('Event', eventSchema);
const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = {
  Event,
  Attachment,
};