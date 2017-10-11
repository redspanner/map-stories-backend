const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Schema = mongoose.Schema;

const attachmentsSchema = new Schema({
  text: String,
  link: String,
  imageLink: String,
  video: String,
  audio: String,
});

const eventSchema = new Schema({
  id: String,
  title: String,
  startTime: String,
  attachments: [attachmentsSchema]
});

const storySchema = new Schema({
  editor: { type: Schema.Types.ObjectId, ref: 'Editor' },
  title: String,
  map: String,
  tagLine: String,
  duration: String,
  events:[eventSchema],//[{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

const Story = mongoose.model('Story', storySchema);


Story.editStory = (edit) => async (edits, params) => {
  const updatedProps = {};
  if (edits.title) updatedProps.title = edits.title;
  if (edits.map) updatedProps.map = edits.map;
  if (edits.tagLine) updatedProps.tagLine = edits.tagLine;
  if (edits.duration) updatedProps.duration = edits.duration;
  if (edits.published) updatedProps.published = edits.published;
  if (edits.likes) updatedProps.likes = edits.likes;
  return await Story.findOneAndUpdate({_id : params.id}, {$set: updatedProps});
};

Story.getAllStories = () => {
  return Story
      .find()
      .select('editor title tagLine'); //id is returned by default
};

Story.getStoriesByTitle = async (query) => {
  const stories = await Story
      .find({'title' : new RegExp(query, 'gi')})
      .populate('editor');

  if (stories) {
    return stories;
  }

};


Story.getStoriesByEditor = async (id) => {
  const stories = await Story
      .find({'editor' : new ObjectId(id)})
      .populate('editor');

  if (stories) {
    return stories;
  }

};


Story.viewStory = (params) => {
  return Story.findOne({_id : params.id});
};


Story.createStory = async (story) => {
  const newStory = new Story(story);
  try {
    return await newStory.save();
  } catch (e) {
    console.log('err', e);
  }
};

module.exports = Story;
