const mongoose = require('mongoose');
const Story = require('../model/model');

const getAllStories = async (ctx, next) => {
  try {
    const stories = await Story.getAllStories();
    ctx.body = stories;
  } catch (error) {
    console.log(error);
  }
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
    const createdStory = await Story.createStory(ctx.request.body);
    ctx.status = 200;
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
  viewStory,
  createStory,
  editStoryMeta,
};
