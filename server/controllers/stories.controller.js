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
    const q = ctx.request.query.q
    const stories = await Story.getAllStories(page);
    const searchTerm = {};
    searchTerm.title = q;

    ctx.body = stories;
  } catch (e) {
    ctx.throw(400, 'Page does not exist!');
  }
};

const findStory = async (ctx, next) => {
  const storyId = ctx.params.id;
  const story = await Story.findStory(storyId);
  ctx.body = story;
};

const createStory = async (ctx, next) => {
  if (ctx.token) {
    const token = ctx.token.split(' ')[1];
    const editorEmail = ctx.request.body.email;
    const updatedEditor = await Editor.findOne({email : editorEmail});
    if (token === updatedEditor.token) {
      const storyData = {
        editor: await Editor.findOne({'email': editorEmail}),
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
    }
  }
  // else send a 401 (if no token present)
};

const editStory = async (ctx, next) => {
  const edits = ctx.request.body;
  const storyId = ctx.params.id;
  const updatedProps = {};

  if (edits.published) {
    const storyToPublish = await Story.findStory(storyId);
    if (storyToPublish.events.length < 1) {
      ctx.throw(400, 'A Story cannot be published without events!');
      return ctx.body;
    }
  }

  if (edits.title) updatedProps.title = edits.title;
  if (edits.map) updatedProps.map = edits.map;
  if (edits.tagLine) updatedProps.tagLine = edits.tagLine;
  if (edits.duration) updatedProps.duration = edits.duration;
  if (edits.published) updatedProps.published = edits.published;
  if (edits.likes) updatedProps.likes = edits.likes;

  await Story.editStory(storyId, updatedProps);
  const updatedStory = await Story.findStory(storyId);

  ctx.body = updatedStory;
};

const deleteStory = async (ctx, next) => {
  const storyId = ctx.params.id;
  const story = await Story.findStory(storyId);
  const storyTitle = story.title;
  await Story.deleteStory(storyId);
  const remainingStories = await Story.getAllStories();
  ctx.body = remainingStories;
  ctx.status = 200;
};

module.exports = {
  getAllStories,
  // getQuery,
  findStory,
  createStory,
  editStory,
  deleteStory,
};
