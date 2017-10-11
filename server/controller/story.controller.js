const mongoose = require('mongoose');
const Story = require('../model/story.model');
const Editor = require('../model/editor.model');

const getAllStories = async (ctx, next) => {
  try {
    const page = parseInt(ctx.params.page);
    if (ctx.params.page && typeof page === 'number') {
      const stories = await Story.getAllStories();
      const pagination = page - 1;
      const limit = 20;
      const results = stories.slice(pagination*limit, pagination*limit + limit);
      ctx.body = results;
    }
  } catch (error) {
    console.log(error);
  }
};

const getQuery = async (ctx, next) => {
  const searchResults = []
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
};

const viewStory = async (ctx, next) => {
  try {
    const story = await Story.viewStory(ctx.params);
    ctx.body = story;
  } catch (error) {
    console.log(error);
  }
};

const createStory = async (ctx, next) => {
  try {
    const storyData = {
      editor: await Editor.findOne({'name':'Ian Banks'}),
      title: ctx.request.body.title,
      tagLine: ctx.request.body.tagLine,
      map: ctx.request.body.map,
      duration: ctx.request.body.duration,
      // events: await Events.createEvent(),
    };
    const createdStory = await Story.createStory(storyData);
    ctx.status = 201;
    ctx.body = createdStory;
  } catch (error) {
    ctx.throw('Could not create story!');
  }
};

const editStoryMeta = async (ctx, next) => {
  try {
    const editedStory = await Story.editStoryMeta(ctx.request.body, ctx.params);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(401, 'Could not edit story!');
  }
};

module.exports = {
  getAllStories,
  getQuery,
  viewStory,
  createStory,
  editStoryMeta,
};
