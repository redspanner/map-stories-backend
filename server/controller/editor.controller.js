const mongoose = require('mongoose');
const Editor = require('../model/editor.model');

const createEditor = async (ctx, next) => {
  try {
    const editor = await Editor.createEditor(ctx.request.body);
    ctx.status = 200;
  } catch (e) {
    console.log(error);
  }
};

module.exports = {
  createEditor,
}
