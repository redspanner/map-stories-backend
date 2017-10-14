const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Story = require('../model/story.model');

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
  dateAndTime: Date,
  mapLocation: String,
  attachments: [attachmentSchema],
});

const Event = mongoose.model('Event', eventSchema);
const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = {
  Event,
  Attachment,
};

// module.exports = Event;

// Event.edit = async (edits, params) => {
//   const updatedProps = {};
//   if (edits.title) updatedProps.title = edits.title;
//   if (edits.startTime) updatedProps.startTime = edits.startTime;
//   return await Event.findOneAndUpdate({_id : params.id}, {$set: updatedProps});
// };
