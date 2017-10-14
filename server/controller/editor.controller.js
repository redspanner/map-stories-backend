const mongoose = require('mongoose');
const Editor = require('../model/editor.model');

const createEditor = async (ctx, next) => {
  const editorData = {
    name: ctx.request.body.name,
    email: ctx.request.body.email,
  };
  const editorEmail = editorData.email;
  const editorExists = await Editor.findOne({editorEmail});
  if (editorExists !== null) {
    ctx.body = 'Editor already exists.';
    return;
  } else {
    const editor = await Editor.createEditor(editorData);
    ctx.status = 200;
  }
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
};
