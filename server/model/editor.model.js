const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const editorSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  name: String,
  avatar: String,
});

const Editor = mongoose.model('Editor', editorSchema);

Editor.createEditor = async (name) => {
  console.log('XXXXXXXXXXXXXXXX');
  const newEditor = new Editor (name);
  try {
    return await newEditor.save();
  } catch (e) {
    console.log('err', e);
  }
};

module.exports = Editor;
