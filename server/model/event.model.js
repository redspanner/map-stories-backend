const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Story = require('../model/story.model');

const attachmentSchema = new Schema({
  type: String,
  url: String,
  imageUrl: String,
  title: String,
  text: String,
});

const coordinatesSchema = new Schema({
  lat: String,
  lng: String,
});

const eventSchema = new Schema({
  title: String,
  startTime: String,
  dateAndTime: String,
  mapLocation: String,
  coordinates: [coordinatesSchema],
  attachments: [attachmentSchema],
});

const Event = mongoose.model('Event', eventSchema);
const Coordinates = mongoose.model('Coordinates', coordinatesSchema);
const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = {
  Event,
  Coordinates,
  Attachment,
};
