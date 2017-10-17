const mongoose = require('mongoose');
const Story = require('../model/story.model');
const Editor = require('../model/editor.model');

// const getAllStories = async (ctx, next) => {
//   //filter for published stories
//   const page = parseInt(ctx.params.page);
//   if (ctx.params.page && typeof page === 'number') {
//     const stories = await Story.getAllStories();
//     const pagination = page - 1;
//     const limit = 20;
//     const results = stories.slice(pagination*limit, pagination*limit + limit);
//     if (results.length > 0) {
//       ctx.body = results.filter(story => story.published);
//     } else {
//       ctx.throw(400, 'Page does not exist!');
//     }
//   }
// };
//
// const getQuery = async (ctx, next) => {
//   const searchResults = [];
//   const query = ctx.request.query.q;
//   const allStories = await Story.getAllStories();
//   const searchTerm = new RegExp(query, 'gi');
//   for (var i = 0; i < allStories.length; i++) {
//     if (allStories[i].title.match(searchTerm)) {
//       searchResults.push(allStories[i]);
//     }
//   }
//   for (var j = 0; j < allStories.length; j++) {
//     if (allStories[j].editor.name.match(searchTerm)) {
//       searchResults.push(allStories[j]);
//     }
//   }
//   ctx.body = searchResults;
// };

const getAllStories = async (ctx, next) => {
  try {
    const page = parseInt(ctx.request.query.page);
    const q = ctx.request.query.q;
    const searchTerm = {};
    const regexp = new RegExp(q , 'gi')
    if (q) {
      searchTerm.title = regexp;
    }
    const stories = await Story.getAllStories(searchTerm, page);
    ctx.body = stories;

  } catch (e) {
    ctx.throw(400, 'No results found.');
  }
};

const findStory = async (ctx, next) => {
  const storyId = ctx.params.id;
  const story = await Story.findStory(storyId);
  ctx.body = story;
};

const createStory = async (ctx, next) => {
  const storyData = {
    editor: ctx.user,
    title: ctx.request.body.title,
    tagLine: ctx.request.body.tagLine,
    map: ctx.request.body.map,
    duration: ctx.request.body.duration,
    published: false,
    likes: 0,
    events: [],
  };
  if (storyData.title.length > 1) {
    const newStory = new Story(storyData);
    const createdStory = await Story.createStory(newStory);
    ctx.status = 201;
    ctx.body = createdStory;
  } else {
    ctx.throw(400,'Your story needs a valid title!');
  }
};

const editStory = async (ctx, next) => {
  const data = ctx.request.body;
  const storyId = ctx.params.id;
  const updatedProps = {};
  const story = await Story.findOne({_id: storyId, editor: ctx.user._id});

  if (!story) {
    ctx.throw(404);
  }

  if (data.published) {
    if (story.events.length < 1) {
      ctx.throw(400, 'A Story cannot be published without events!');
      return ctx.body;
    }
  }

  if (data.title) story.title = data.title;
  if (data.map) story.map = data.map;
  if (data.tagLine) story.tagLine = data.tagLine;
  if (data.duration) story.duration = data.duration;
  if (data.published !== undefined) story.published = data.published;

  ctx.body = await story.save();
};

const deleteStory = async (ctx, next) => {
  const storyId = ctx.params.id;
  const story = await Story.findOne({ _id: storyId, editor: ctx.user._id });
  if (!story) return ctx.throw(404);
  await Story.deleteStory(storyId);
  ctx.status = 204;
};

module.exports = {
  getAllStories,
  // getQuery,
  findStory,
  createStory,
  editStory,
  deleteStory,
};
