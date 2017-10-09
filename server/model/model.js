const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Console = console;

const editorSchema = new Schema({
  id: String,
  name: String,
});

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
  editor: editorSchema,
  title: String,
  id: String,
  map: String,
  tagLine: String,
  dateCreated: String,
  published: Boolean,
  likes: Number,
  duration: String,
  events:[eventSchema],
});

const Story = mongoose.model('Story', storySchema);

module.exports.getAllStories = async () => {
  try {
    const stories = await Story
      .find()
      .select('editor title tagLine'); //id is returned by default
    return stories;
  } catch (error) {
    Console.error(error);
  }
};

module.exports.viewStory = async (params) => {
  try {
    const story = await Story.findOne({_id : params.id});
    return story;
  } catch (error) {
    Console.error(error);
  }
};

module.exports.createStory = async (story) => {
  try {
    const newStory = new Story(story);
    await newStory.save();
  } catch (error) {
    Console.error(error);
  }
};

module.exports.editStoryMeta = async (edits, params) => {
  const updatedProps = {};
  if (edits.title) updatedProps.title = edits.title;
  if (edits.map) updatedProps.map = edits.map;
  if (edits.tagLine) updatedProps.tagLine = edits.tagLine;
  if (edits.duration) updatedProps.duration = edits.duration;
  if (edits.published) updatedProps.published = edits.published;
  if (edits.likes) updatedProps.likes = edits.likes;
  await Story.findOneAndUpdate({_id : params.id}, {$set: updatedProps}, (error, doc) => {
    if (error) {
      Console.log(error);
    }
    Console.log(doc);
  });
};

// module.exports = Story;
