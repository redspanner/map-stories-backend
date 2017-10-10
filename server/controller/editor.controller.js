const mongoose = require('mongoose');
const Editor = require('../model/editor.model');

const createEditor = async (ctx, next) => {
  try {
    const editorData = {
      name: ctx.request.body.name,
      avatar: ctx.request.body.avatar
    };
    const editor = await Editor.createEditor(editorData);
    ctx.status = 200;
  } catch (e) {
    console.log(error);
  }
};

module.exports = {
  createEditor,
}
