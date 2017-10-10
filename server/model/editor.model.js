const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const editorSchema = new Schema({
  // _id: Schema.Types.ObjectId, //in documentation (http://mongoosejs.com/docs/populate.html) but causes error, why?
  name: String,
  avatar: String,
});

const Editor = mongoose.model('Editor', editorSchema);

Editor.createEditor = async (name) => {
  const newEditor = new Editor (name);
  try {
    return await newEditor.save();
  } catch (e) {
    console.log('err', e);
  }
};

module.exports = Editor;
