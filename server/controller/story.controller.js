const mongoose = require('mongoose');
const Story = require('../model/story.model');
const Editor = require('../model/editor.model');

const getAllStories = async (ctx, next) => {
  const page = parseInt(ctx.params.page);
  if (ctx.params.page && typeof page === 'number') {
    const stories = await Story.getAllStories();
    const pagination = page - 1;
    const limit = 20;
    const results = stories.slice(pagination*limit, pagination*limit + limit);
    ctx.body = results;
  }
};

const getQuery = async (ctx, next) => {
  const searchResults = [];
  const query = ctx.request.query.q;
  const searchedEditors = await Editor.searchEditors(query);
  const editorIds = searchedEditors.map(editor => editor['_id']);
  for (let i = 0; i < editorIds.length; i++) {
    const storiesByEditor = await Story.getStoriesByEditor(editorIds[i]);
    if (storiesByEditor.length > 0) {
      for (let j = 0; j < storiesByEditor.length; j++) {
        searchResults.push(storiesByEditor[j]);
      }
    }
  }
  const storiesByTitle = await Story.getStoriesByTitle(query);
  for (let k = 0; k < storiesByTitle.length; k++) {
    searchResults.push(storiesByTitle[k]);
  }
  ctx.body = searchResults;
  return searchResults;
};

const findStory = async (ctx, next) => {
  const storyId = ctx.params.id;
  const story = await Story.findStory(storyId);
  ctx.body = story;
};

const createStory = async (ctx, next) => {
  const storyData = {
    editor: await Editor.findOne({'name':'Charlie Stross'}),
    title: ctx.request.body.title,
    tagLine: ctx.request.body.tagLine,
    map: ctx.request.body.map,
    duration: ctx.request.body.duration,
    events: [],
  };
  if (storyData.title.length > 1) {
    const newStory = new Story(storyData);
    const createdStory = await Story.createStory(newStory);
    ctx.status = 201;
    ctx.body = createdStory;
  } else {
    ctx.body = {'message': 'Your story needs a valid title!'};
    return ctx.body; //possible to pass test w/o returning anything?
  }
};

const editStory = async (ctx, next) => {
  const edits = ctx.request.body;
  const storyId = ctx.params.id;
  const updatedProps = {};

  if (edits.published) {
    const storyToPublish = await Story.findStory(storyId);
    if (storyToPublish.events.length < 1) {
      ctx.body = {'message': 'A Story cannot be published without events!'};
      return ctx.body;
    }
  }

  if (edits.title) updatedProps.title = edits.title;
  if (edits.map) updatedProps.map = edits.map;
  if (edits.tagLine) updatedProps.tagLine = edits.tagLine;
  if (edits.duration) updatedProps.duration = edits.duration;
  if (edits.likes) updatedProps.likes = edits.likes;

  await Story.editStory(storyId, updatedProps);
  const updatedStory = await Story.findStory(storyId);

  ctx.body = updatedStory;
};

const deleteStory = async (ctx, next) => {
  // const storyId = ctx.params.id;
  // await Story.delete
};

module.exports = {
  getAllStories,
  getQuery,
  findStory,
  createStory,
  editStory,
  deleteStory,
};
