const mongoose = require('mongoose');
const Story = require('../model/story.model');
const Editor = require('../model/editor.model');

const createEditor = async (ctx, next) => {
  const token = ctx.token.split(' ')[1];
  const editorData = {
    name: ctx.request.body.name,
    email: ctx.request.body.email,
    token: token,
    picture: ctx.request.body.picture,
  };
  const editorEmail = editorData.email;
  const editorExists = await Editor.findOne({email: editorEmail});
  if (editorExists !== null) {
    const updatedEditor = await Editor.findOneAndUpdate({email : editorEmail}, {$set: {token: editorData.token}}, {new: true});
    ctx.body = updatedEditor;
    ctx.status = 200;
  } else {
    const editor = await Editor.createEditor(editorData);
    ctx.body = editor;
    ctx.status = 200;
  }
};

const signoutEditor = async (ctx, next) => {
  const editorEmail = ctx.request.body.email;
  const updatedEditor = await Editor.findOneAndUpdate({email : editorEmail}, {$set: {token: null}}, {new: true});
  ctx.body = updatedEditor;
  ctx.status = 200;
};

const getEditorStories = async (ctx, next) => {
  const stories = await Story.getAllStories();
  const editorStories = stories.filter(story => String(story.editor._id) === ctx.params.id);
  ctx.body = editorStories;
  ctx.status = 200;
};

// const findEditor = async (ctx, next) => {
//   const editorData = {
//     name: ctx.request.body.name,
//     email: ctx.request.body.email
//   };
//   const editor = await Editor.createEditor(editorData);
//   ctx.status = 200;
// };

module.exports = {
  createEditor,
  signoutEditor,
  getEditorStories,
};
